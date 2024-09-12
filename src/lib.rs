use wasm_bindgen::prelude::*;
use zkwasm_rest_abi::*;
pub mod config;
pub mod events;
pub mod settlement;
pub mod state;

use crate::config::Config;
use crate::state::{State, Transaction};

#[no_mangle]
pub static ZKC_ENABLE_MERKLE_TREE_SUPPORT: i64 = 1;

zkwasm_rest_abi::create_zkwasm_apis!(Transaction, State, Config);
