// https://eips.ethereum.org/EIPS/eip-20
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract SendEth {
    function send(address payable _receiver) external payable {
        _receiver.transfer(msg.value);
    }
}
