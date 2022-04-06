#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod vrmetax1 {

use ink_storage::traits::SpreadAllocate;
use ink_storage::Mapping;

#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum Error {
    /// Returned if caller is not the owner.
    NonOwner,
}

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
#[ink(storage)]
#[derive(SpreadAllocate)]
   pub struct Vrmetax1 {
    /// Points from the game.
    pub points: Mapping<AccountId, u32>,
    /// Master wallet who receives funds from game.
    pub master_address: AccountId,
    /// Items in the game.  Can be customized according to the item itself.
    pub ammo: Mapping<AccountId, Balance>,
    pub ammo_price: Balance,
    /// Items.
    pub missiles: Mapping<AccountId, Balance>,
    pub missiles_price: Balance,
    /// Gun Rights
    pub gun_rights: Mapping<AccountId, bool>,
    /// NFT Skins
    pub nft_skins: Mapping<AccountId, bool>
}

    impl Vrmetax1 {
        #[ink(constructor, payable)]
        pub fn new() -> Self {
            // Even though we're not explicitly initializing the `Mapping`,
            // we still need to call this
            ink_lang::utils::initialize_contract(Self::new_init) 
        }

         /// Default initializes the contract.
    fn new_init(&mut self) {
        let caller = Self::env().caller();
        self.master_address = caller;
        self.ammo.insert(caller, &0);
        self.ammo_price = 1_000_000_000;
        self.missiles.insert(caller, &0);
        self.missiles_price = 10_000_000_000;
        self.gun_rights.insert(caller, &false);
        self.nft_skins.insert(caller, &false);
    }

        #[ink(message, payable)]
        pub fn buy_ammo(&mut self, _amount: Balance) {
            let caller: AccountId = self.env().caller();
            let price: Balance = self.ammo_price;

            //assert!(sent_amount >= 1_000000000);

            let amount: Balance = _amount * 1000000000;
            assert!(amount >= price, "1 coin or naught");

            let bullets: Balance = amount / 1_000_000_000;

            if self.env().transfer(self.master_address, amount).is_err() {
                panic!(
                    "Funding problem."
                )
            }

            let old_amount = self.ammo.get(&caller);
            if old_amount == None {
                self.ammo.insert(caller, &bullets)
            } 
            else {
                self.ammo.insert(caller, &(bullets + old_amount.unwrap()));
            }
            
        }

        #[ink(message, payable)]
        pub fn buy_missiles(&mut self, _amount: Balance) {
            let caller: AccountId = self.env().caller();
            let price: Balance = self.missiles_price;

            let amount: Balance = _amount * 10_000_000_000;

            assert!(amount >= price, "10 coins or naught");
            let missiles = amount / 10_000_000_000;

            if self.env().transfer(self.master_address, amount).is_err() {
                panic!(
                    "Funding problem."
                )
            }
            let old_amount = self.missiles.get(&caller);
            if old_amount == None {
                self.missiles.insert(caller, &missiles)
            } 
            else {
                self.missiles.insert(caller, &(missiles + old_amount.unwrap()));
            }
        }

        #[ink(message, payable)]
        pub fn buy_gun_rights(&mut self) {
            let caller: AccountId = self.env().caller();
            let price: Balance = 50_000_000_000;

            let amount = self.env().transferred_value();
            assert!(amount >= price, "50 coins or naught");

            if self.env().transfer(self.master_address, amount).is_err() {
                panic!(
                    "Funding problem."
                )
            }

            self.gun_rights.insert(caller, &true);
        }

        #[ink(message, payable)]
        pub fn buy_nft_skin(&mut self) {
            let caller: AccountId = self.env().caller();
            let price: Balance = 200_000_000_000;

            let amount = price;
            assert!(amount >= price, "200 coins or naught");

            if self.env().transfer(self.master_address, amount).is_err() {
                panic!(
                    "Funding problem."
                )
            }

            self.nft_skins.insert(caller, &true);
        }

        #[ink(message)]
        pub fn shoot_ammo(&mut self, amount_bullets: Balance) {
            let caller: AccountId = self.env().caller();
            let ammo_before = self.ammo.get(&caller).unwrap();
            let amount_left = ammo_before - amount_bullets;
            self.ammo.insert(caller, &amount_left)
        }

        /// Return ammo
        #[ink(message)]
        pub fn get_ammo(&self) -> Balance {
            let caller: AccountId = self.env().caller();
            let result = self.ammo.get(&caller);
            if result == None {
                return 0
            } 
            else {
                return result.unwrap()
            }
        }

         /// Return ammo
         #[ink(message)]
         pub fn get_missiles(&self) -> Balance {
             let caller: AccountId = self.env().caller();
             let result = self.missiles.get(&caller);
            if result == None {
                return 0
            } 
            else {
                return result.unwrap()
            }
         }

         #[ink(message)]
         pub fn get_gun_rights(&self) -> bool {
             let caller: AccountId = self.env().caller();
             self.gun_rights.get(&caller).unwrap()
         }

         #[ink(message)]
         pub fn get_owns_nft_skin(&self) -> bool {
             let caller: AccountId = self.env().caller();
             self.nft_skins.get(&caller).unwrap()
         }

         #[ink(message)]
         pub fn set_ammo_missile_prices(&mut self, ammo_price: Balance, missile_price: Balance) {
            let caller: AccountId = self.env().caller();
            assert!(caller == self.master_address, "Only the Owner can set the Prices");
            self.ammo_price = ammo_price;
            self.missiles_price = missile_price; 
         }

    }

    /// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// Imports `ink_lang` so we can use `#[ink::test]`.
        use ink_lang as ink;

        const DEFAULT_GAS_LIMIT: Balance = 1_000_000;

        fn default_accounts() -> ink_env::test::DefaultAccounts<ink_env::DefaultEnvironment> {
            ink_env::test::default_accounts::<ink_env::DefaultEnvironment>()
                .expect("off-chain environment should have been initialized already")
        }

        fn set_next_caller(caller: AccountId, value: Balance) {
            ink_env::test::push_execution_context::<ink_env::DefaultEnvironment>(
                caller,
                contract_id(),
                DEFAULT_GAS_LIMIT.try_into().unwrap(),
                value,
                ink_env::test::CallData::new(ink_env::call::Selector::new([0x00; 4])),
            )
        }

        fn get_balance(account_id: AccountId) -> Balance {
            ink_env::test::get_account_balance::<ink_env::DefaultEnvironment>(account_id)
                .expect("Cannot set account balance")
        }

        fn set_balance(account_id: AccountId, balance: Balance) {
            ink_env::test::set_account_balance::<ink_env::DefaultEnvironment>(account_id, balance)
                .expect("Cannot set account balance");
        }

        fn contract_id() -> AccountId {
            ink_env::test::get_current_contract_account_id::<ink_env::DefaultEnvironment>()
                .expect("Cannot get contract id")
        }

        /// We test if the default constructor does its job.
        #[ink::test]
        fn default_works() {
            let vrmetax1 = Vrmetax1::new();
            let result = vrmetax1.get_ammo();
            assert_eq!(result, 0);
        }

        #[ink::test]
        fn buy_ammo_works() {
            let mut vrmetax1 = Vrmetax1::new();
            let accounts = default_accounts();
            let og_bal = get_balance(vrmetax1.master_address);
            set_next_caller(accounts.alice, 100_000_000_000);
            set_balance(contract_id(), 10_000_000_000);
            vrmetax1.buy_ammo(10);

            let result2 = vrmetax1.get_ammo();
            let result3 = get_balance(vrmetax1.master_address);
            assert_eq!(result2, 10);
            assert_eq!(result3, og_bal + 10_000_000_000);
        }

        #[ink::test]
        fn buy_missiles_works() {
            let mut vrmetax1 = Vrmetax1::new();
            let accounts = default_accounts();
            let og_bal = get_balance(vrmetax1.master_address);
            set_next_caller(accounts.alice, 100_000_000_000);
            set_balance(contract_id(), 50_000_000_000);
            vrmetax1.buy_missiles(5);

            let result2 = vrmetax1.get_missiles();
            let result3 = get_balance(vrmetax1.master_address);
            assert_eq!(result2, 5);
            assert_eq!(result3, og_bal + 50_000_000_000);
        }

        #[ink::test]
        fn buy_nft_skin_works() {
            let mut vrmetax1 = Vrmetax1::new();
            let accounts = default_accounts();
            let og_bal = get_balance(vrmetax1.master_address);

            let owns1 = vrmetax1.get_owns_nft_skin();
            assert_eq!(owns1, false);

            set_next_caller(accounts.alice, 200_000_000_000);
            set_balance(contract_id(), 200_000_000_000);
            vrmetax1.buy_nft_skin();

            let owns2 = vrmetax1.get_owns_nft_skin();
            let result3 = get_balance(vrmetax1.master_address);

            assert_eq!(owns2, true);
            assert_eq!(result3, og_bal + 200_000_000_000);
        }

        #[ink::test]
        fn set_price_works() {
            let mut vrmetax1 = Vrmetax1::new();
            let accounts = default_accounts();
            let og_bal = get_balance(vrmetax1.master_address);
            set_next_caller(accounts.alice, 100_000_000_000);

            set_balance(contract_id(), 10_000_000_000);
            vrmetax1.buy_ammo(10);
            let result2 = vrmetax1.get_ammo();
            let og_bal2 = get_balance(vrmetax1.master_address);
            assert_eq!(result2, 10);
            assert_eq!(og_bal2, og_bal + 10_000_000_000);
            

            vrmetax1.set_ammo_missile_prices(2_000_000_000, 1_000_000_000);
            set_next_caller(accounts.bob, 100_000_000_000);
            set_balance(contract_id(), 20_000_000_000);
            vrmetax1.buy_ammo(5);
            let result3 = vrmetax1.get_ammo();
            assert_eq!(result3, 5);
            let og_bal3 = get_balance(vrmetax1.master_address);
            assert_eq!(og_bal3, og_bal2 + 10_000_000_000);
         
        }




    }
}


