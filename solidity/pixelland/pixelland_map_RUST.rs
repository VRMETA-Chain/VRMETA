#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod pixellandmap {

use ink_storage::traits::SpreadAllocate;
use ink_storage::Mapping;

pub type Coords = [u32; 2];
pub type Grid = [Coords; 2];

#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum Error {
    /// Returned if caller is not the owner.
    NonOwner,
    /// Out of Bounds
    OutOfBounds,
    /// Already Owned
    AlreadyOwned,
    /// Not for sale
    NotForSale
}

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
#[ink(storage)]
#[derive(SpreadAllocate)]
   pub struct Pixellandmap {
    /// Plots owned.
    pub plot: Mapping<AccountId, Grid>,
    /// Master wallet who receives funds from game.
    pub owner: AccountId,
    /// Mapsize
    pub map_size: Grid,
    /// Ownership Tracker
    pub is_owned: Mapping<Coords, bool>,
    pub is_owner: Mapping<Coords, AccountId>,
}

    impl Pixellandmap {
        #[ink(constructor, payable)]
        pub fn new() -> Self {
            // Even though we're not explicitly initializing the `Mapping`,
            // we still need to call this
            ink_lang::utils::initialize_contract(Self::new_init) 
        }

         /// Default initializes the contract.
    fn new_init(&mut self) {
        let caller = Self::env().caller();
        self.owner = caller;
        self.plot.insert(caller, &[[0,0], [10,10]]);
        self.map_size = [[0, 0], [100, 100]];

        let mut x: u32 = 0;
        let mut y: u32 = 0;
        while y <= 100 {
            while x <= 100 {
                self.is_owned.insert([x, y], &false);
                x += 1;
            }
            y += 1;
        }

        let mut x2: u32 = 0;
        let mut y2: u32 = 0;
        while y2 <= 10 {
            while x2 <= 10 {
                self.is_owned.insert([x2, y2], &true);
                self.is_owner.insert([x2, y2], &caller);
                x2 += 1;
            }
            y2 += 1;
        }

        
    }



        #[ink(message)]
        pub fn get_plot(&mut self, who: AccountId) -> Grid {
            let caller: AccountId = self.env().caller();
            self.plot.get(&caller).unwrap()
        }

        #[ink(message)]
        pub fn get_map_size(&mut self) -> Grid {
            self.map_size
        }

        #[ink(message)]
        pub fn check_if_owned(&mut self, coords: Grid) -> bool {
            let mut x = coords[0][0];
            let mut y = coords[0][1];
            let x2 = coords[1][0];
            let y2 = coords[1][1];
            while y <= y2 {
                while x <= x2 {
                    let result: bool = self.is_owned.get(&[x, y]).unwrap();
                    if result == true {
                        return true;
                    } 
                    else {
                        x += 1;
                    }
                    
                }
                y += 1;
            }
            return false;
        }

        #[ink(message)]
        pub fn get_owner(&mut self, coords: Coords) -> AccountId {
            let result = self.is_owner.get(coords).unwrap();
            result.into()
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

        /// We test if the default constructor does its job.
        #[ink::test]
        fn default_works() {
            let pixellandmap = Pixellandmap::new();
            let result = pixellandmap.map_size;
            assert_eq!(result, [[0,0], [100,100]]);
        }

        #[ink::test]
        fn ownership_works() {
            let mut pixellandmap = Pixellandmap::new();
            let result = pixellandmap.check_if_owned([[0,0], [10, 2]]);
            assert_eq!(result, true);
            let result2 = pixellandmap.check_if_owned([[20,0], [50, 1]]);
            assert_eq!(result2, false);
        }

        #[ink::test]
        fn get_owner_works() {
            let mut pixellandmap = Pixellandmap::new();
            let result = pixellandmap.get_plot(pixellandmap.owner);
            let result2 = pixellandmap.get_owner(result[0]);
            assert_eq!(result2, pixellandmap.owner);
           
        }


    }
}


