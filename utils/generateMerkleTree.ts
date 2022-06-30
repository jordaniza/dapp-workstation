import { keccak256 } from '@ethersproject/keccak256';
import { ethers } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import { WHALES } from "./addresses";

type Proof = { position: string, data: Buffer };
type MerkleTreeReturn = { root: string, proof: string[] }

/**
 * Encodes a solidity-friendly hash of an address in the required format for the vault
 * leaf nodes (abi encoded 'address,bool'). 
 * 
 * @param address the address to add as a leaf
 * @returns encoded hash of the address and the boolean `true`
 */
function hash(address: string) {
    const keccak = ethers.utils.solidityKeccak256(['address','bool'],[address,true]);
    const sliceKeccak = keccak.slice(2);
    const buff = Buffer.from(sliceKeccak, 'hex');
    const output = ethers.utils.hexlify(buff);
    return output
}

// Convert Buffer data to a more standard `0x....` representation.
const hexlifyProof = (p: Proof) => ethers.utils.hexlify(p.data)


/**
 * Gas efficient EVM solutions make use of merkle roots to avoid storing large data structures on-chain.
 * This function creates a new merkle tree with an account added as a leaf node.  
 * 
 * @param account to add to the merkle tree
 * @returns the merkle root for the tree and the merkle proof for the account
 */
export function merkleTreeAndRoot(account: string): MerkleTreeReturn {
    const addresses = [account, ...Object.values(WHALES)];
    
    const Leaves = addresses.map(hash);
    const Tree = new MerkleTree(Leaves, keccak256, {sortPairs: true});

    const root = Tree.getHexRoot();
    const leaf = hash(account);
    const _proof = Tree.getProof(leaf) as Proof[];

    const proof = _proof.map(hexlifyProof);    

    const valid = Tree.verify(_proof, leaf, root);

    if (!valid) throw Error('Invalid Merkle Tree');

    return {
        root,
        proof
    }
}