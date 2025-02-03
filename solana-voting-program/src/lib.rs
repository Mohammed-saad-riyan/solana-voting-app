use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CandidateAccount {
    pub vote_count: u32,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let candidate_account = next_account_info(accounts_iter)?;

    // Ensure the candidate account is owned by the program
    if candidate_account.owner != program_id {
        msg!("Candidate account does not belong to this program.");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize vote count
    let mut candidate_data = CandidateAccount::try_from_slice(&candidate_account.data.borrow())?;
    msg!("Current vote count: {}", candidate_data.vote_count);

    // Increment vote count
    candidate_data.vote_count += 1;
    candidate_data.serialize(&mut &mut candidate_account.data.borrow_mut()[..])?;

    msg!("Updated vote count: {}", candidate_data.vote_count);
    Ok(())
}
