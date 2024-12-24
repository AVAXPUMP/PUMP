import {ethers} from "ethers";
import {FactoryAbi} from "@/store/TokenFactory";
import {UniswapV2FactoryAbi} from "@/store/UniswapV2FactoryAbi";
import {UniswapV2Router02Abi} from "@/store/UniswapV2Router02Abi";
import {BondingCurveAbi} from "@/store/BondingCurveAbi";

const rpc_url = 'https://avalanche-c-chain-rpc.publicnode.com';
const factory_address = '0xcc2efEC49DD1Df0845536419639B4Ee6Df1e82Ec';
const bondingCurve_address = "0xf95CCfb6dB8E2F26eD3021D466271D638Ffd4193"
export const uni_factory_address = "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6"
export const weth_address = "0x4200000000000000000000000000000000000006"
export const uni_router_address = "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24";


export const default_provider = new ethers.JsonRpcProvider(rpc_url);

export const factory = new ethers.Contract(factory_address, FactoryAbi, default_provider);
export const bondingCurve = new ethers.Contract(bondingCurve_address, BondingCurveAbi, default_provider);
export const uni_factory_contract = new ethers.Contract(uni_factory_address, UniswapV2FactoryAbi, default_provider);
export const router = new ethers.Contract(uni_router_address, UniswapV2Router02Abi, default_provider);
