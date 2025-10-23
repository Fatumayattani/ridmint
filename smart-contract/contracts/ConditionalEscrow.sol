// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract ConditionalEscrow is ReentrancyGuard {
    enum ConditionType { TIME_DELAY, EVENT }
    enum PaymentStatus { PENDING, COMPLETED, CANCELLED }

    struct Payment {
        address creator;
        address recipient;
        uint256 amount;
        address token;
        ConditionType conditionType;
        uint256 conditionValue;    // timestamp if time-based, arbitrary if event
        PaymentStatus status;
        uint256 createdAt;
    }

    mapping(uint256 => Payment) public payments;
    uint256 public paymentCounter;

    // Events
    event PaymentCreated(
        uint256 indexed paymentId,
        address indexed creator,
        address indexed recipient,
        uint256 amount,
        address token,
        ConditionType conditionType,
        uint256 conditionValue
    );
    event PaymentReleased(uint256 indexed paymentId, address indexed recipient, uint256 amount);
    event PaymentCancelled(uint256 indexed paymentId, address indexed creator, uint256 amount);

    // Modifiers
    modifier onlyCreator(uint256 _id) {
        require(msg.sender == payments[_id].creator, "Not creator");
        _;
    }

    modifier isPending(uint256 _id) {
        require(payments[_id].status == PaymentStatus.PENDING, "Not pending");
        _;
    }

    /// @notice Create a new conditional payment
    /// @param _recipient Address receiving funds
    /// @param _token Token address (0 for ETH)
    /// @param _amount Amount to escrow
    /// @param _conditionType Type of condition (time delay or event)
    /// @param _conditionValue Seconds delay for TIME_DELAY or arbitrary value for EVENT
    function createPayment(
        address _recipient,
        address _token,
        uint256 _amount,
        ConditionType _conditionType,
        uint256 _conditionValue
    ) external payable nonReentrant returns (uint256) {
        require(_recipient != address(0), "Invalid recipient");
        require(_amount > 0, "Amount required");

        if (_token == address(0)) {
            require(msg.value == _amount, "ETH amount mismatch");
        } else {
            require(msg.value == 0, "Don't send ETH for token payments");
            require(IERC20(_token).transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
        }

        uint256 paymentId = paymentCounter;
        unchecked { paymentCounter++; }

        uint256 conditionTimestamp = _conditionType == ConditionType.TIME_DELAY
            ? block.timestamp + _conditionValue
            : _conditionValue;

        payments[paymentId] = Payment({
            creator: msg.sender,
            recipient: _recipient,
            amount: _amount,
            token: _token,
            conditionType: _conditionType,
            conditionValue: conditionTimestamp,
            status: PaymentStatus.PENDING,
            createdAt: block.timestamp
        });

        emit PaymentCreated(paymentId, msg.sender, _recipient, _amount, _token, _conditionType, _conditionValue);
        return paymentId;
    }

    /// @notice Release a payment when conditions are met
    function releasePayment(uint256 _id) external nonReentrant isPending(_id) {
        Payment storage payment = payments[_id];

        if (payment.conditionType == ConditionType.TIME_DELAY) {
            require(block.timestamp >= payment.conditionValue, "Time condition not met");
        } else {
            require(msg.sender == payment.creator, "Only creator can release event-based");
        }

        payment.status = PaymentStatus.COMPLETED;

        if (payment.token == address(0)) {
            (bool sent, ) = payable(payment.recipient).call{value: payment.amount}("");
            require(sent, "ETH transfer failed");
        } else {
            require(IERC20(payment.token).transfer(payment.recipient, payment.amount), "Token transfer failed");
        }

        emit PaymentReleased(_id, payment.recipient, payment.amount);
    }

    /// @notice Cancel a pending payment and refund creator
    function cancelPayment(uint256 _id) external nonReentrant onlyCreator(_id) isPending(_id) {
        Payment storage payment = payments[_id];
        payment.status = PaymentStatus.CANCELLED;

        if (payment.token == address(0)) {
            (bool sent, ) = payable(payment.creator).call{value: payment.amount}("");
            require(sent, "ETH refund failed");
        } else {
            require(IERC20(payment.token).transfer(payment.creator, payment.amount), "Token refund failed");
        }

        emit PaymentCancelled(_id, payment.creator, payment.amount);
    }

    /// @notice View a payment's details
    function getPayment(uint256 _id) external view returns (Payment memory) {
        return payments[_id];
    }

    /// @notice Check if a payment can be released (useful for frontend polling)
    function canRelease(uint256 _id) external view returns (bool) {
        Payment memory p = payments[_id];
        if (p.status != PaymentStatus.PENDING) return false;
        if (p.conditionType == ConditionType.TIME_DELAY) {
            return block.timestamp >= p.conditionValue;
        }
        return false;
    }

    receive() external payable {}
}
