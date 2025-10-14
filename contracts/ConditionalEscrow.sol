// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract ConditionalEscrow {
    enum ConditionType { TIME_DELAY, EVENT }
    enum PaymentStatus { PENDING, COMPLETED, CANCELLED }

    struct Payment {
        address creator;
        address recipient;
        uint256 amount;
        address token;
        ConditionType conditionType;
        uint256 conditionValue;
        PaymentStatus status;
        uint256 createdAt;
    }

    mapping(uint256 => Payment) public payments;
    uint256 public paymentCounter;

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

    function createPayment(
        address _recipient,
        address _token,
        ConditionType _conditionType,
        uint256 _conditionValue
    ) external payable returns (uint256) {
        require(_recipient != address(0), "Invalid recipient");

        uint256 amount;

        if (_token == address(0)) {
            require(msg.value > 0, "ETH amount required");
            amount = msg.value;
        } else {
            require(msg.value == 0, "Do not send ETH for token payments");
            amount = _conditionValue;
            require(amount > 0, "Token amount required");

            IERC20(_token).transferFrom(msg.sender, address(this), amount);
        }

        uint256 paymentId = paymentCounter++;

        payments[paymentId] = Payment({
            creator: msg.sender,
            recipient: _recipient,
            amount: amount,
            token: _token,
            conditionType: _conditionType,
            conditionValue: _conditionType == ConditionType.TIME_DELAY ? block.timestamp + _conditionValue : _conditionValue,
            status: PaymentStatus.PENDING,
            createdAt: block.timestamp
        });

        emit PaymentCreated(paymentId, msg.sender, _recipient, amount, _token, _conditionType, _conditionValue);

        return paymentId;
    }

    function releasePayment(uint256 _paymentId) external {
        Payment storage payment = payments[_paymentId];

        require(payment.status == PaymentStatus.PENDING, "Payment not pending");

        if (payment.conditionType == ConditionType.TIME_DELAY) {
            require(block.timestamp >= payment.conditionValue, "Time condition not met");
        } else {
            require(msg.sender == payment.creator, "Only creator can release event-based payment");
        }

        payment.status = PaymentStatus.COMPLETED;

        if (payment.token == address(0)) {
            payable(payment.recipient).transfer(payment.amount);
        } else {
            IERC20(payment.token).transfer(payment.recipient, payment.amount);
        }

        emit PaymentReleased(_paymentId, payment.recipient, payment.amount);
    }

    function cancelPayment(uint256 _paymentId) external {
        Payment storage payment = payments[_paymentId];

        require(payment.status == PaymentStatus.PENDING, "Payment not pending");
        require(msg.sender == payment.creator, "Only creator can cancel");

        payment.status = PaymentStatus.CANCELLED;

        if (payment.token == address(0)) {
            payable(payment.creator).transfer(payment.amount);
        } else {
            IERC20(payment.token).transfer(payment.creator, payment.amount);
        }

        emit PaymentCancelled(_paymentId, payment.creator, payment.amount);
    }

    function getPayment(uint256 _paymentId) external view returns (Payment memory) {
        return payments[_paymentId];
    }

    function canRelease(uint256 _paymentId) external view returns (bool) {
        Payment memory payment = payments[_paymentId];

        if (payment.status != PaymentStatus.PENDING) {
            return false;
        }

        if (payment.conditionType == ConditionType.TIME_DELAY) {
            return block.timestamp >= payment.conditionValue;
        }

        return false;
    }
}
