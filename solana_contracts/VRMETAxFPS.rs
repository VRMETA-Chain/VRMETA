use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

declare_id!("DC6fetdodrGu4aNHcsomsGra126xq17EtHicCvMmN4W9");

#[program]
mod mysolanaapp {
    use super::*;

    pub fn create(ctx: Context<Create>, authority: Pubkey) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let system_program = &mut ctx.accounts.system_program;

        game.authority = authority;
        game.ammo_price = 1_000_000_000;
        game.missiles_price = 10_000_000_000;
        Ok(())
    }

    pub fn create_player(ctx: Context<CreatePlayer>, user: Pubkey) -> Result<()> {
        let player = &mut ctx.accounts.player;

        player.key = user;
        player.points = 10;
        player.ammo = 100;
        player.missiles = 5;
        player.gun_rights = false;
        player.nft_skins = false;
        Ok(())
    }

    pub fn buy_ammo(ctx: Context<UpdateInventory>, amount_bullets: u32) -> Result<()> {
        let player = &mut ctx.accounts.player;
        let game = &ctx.accounts.game;
        let from = player.key;

        let price = amount_bullets as u64 * game.ammo_price;
       
        let to = game.authority;

        system_instruction::transfer(&from, &to, price);
        player.ammo += amount_bullets;
        Ok(())
    }
}

// Transaction instructions
#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = authority, space = 16 + 16)]
    pub game: Account<'info, VrmetaxFPS>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Transaction instructions
#[derive(Accounts)]
pub struct CreatePlayer<'info> {
    #[account(init, payer = user, space = 16 + 16)]
    pub player: Account<'info, Player>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Transaction instructions
#[derive(Accounts)]
pub struct UpdateInventory<'info> {
    #[account(mut)]
    pub player: Account<'info, Player>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub game: Account<'info, VrmetaxFPS>,
}

// An account that goes inside a transaction instruction
#[account]
pub struct Player {
    /// Player ID
    pub key: Pubkey,
    /// Points from the game.
    pub points: u32,
    /// Items in the game.  Can be customized according to the item itself.
    pub ammo: u32,
    /// Missiles
    pub missiles: u32,
    /// Gun Rights
    pub gun_rights: bool,
    /// NFT Skins
    pub nft_skins: bool,
}

#[account]
pub struct VrmetaxFPS {
    pub authority: Pubkey,
    pub ammo_price: u64,
    pub missiles_price: u64,
 
}
