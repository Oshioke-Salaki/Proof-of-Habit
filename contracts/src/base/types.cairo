use starknet::ContractAddress;
#[derive(Drop, Serde, starknet::Store)]
pub struct Habit {
    pub id: u32,
    pub owner: ContractAddress,
    pub info: ByteArray,
    pub created_at: u64,
    pub last_log_at: u64,
    pub streak_count: u32,
    pub total_log_count: u32,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Entry {
    pub id: u32,
    pub log_info: ByteArray,
    pub timestamp: u64,
}
