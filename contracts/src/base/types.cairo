use starknet::ContractAddress;
#[derive(Drop, Serde, starknet::Store, Clone)]
pub struct Habit {
    pub id: u32,
    pub owner: ContractAddress,
    pub owner_username: felt252,
    pub info: ByteArray,
    pub created_at: u64,
    pub last_log_at: u64,
    pub streak_count: u32,
    pub total_log_count: u32,
    pub public: bool,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Entry {
    pub id: u32,
    pub log_info: ByteArray,
    pub timestamp: u64,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct User {
    pub id: u32,
    pub address: ContractAddress,
    pub username: felt252,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct RecentLog {
    pub id: u32,
    pub username: felt252,
    pub address: ContractAddress,
    pub habit_info: ByteArray,
    pub log_info: ByteArray,
    pub timestamp: u64,
    pub streak_count: u32,
}
