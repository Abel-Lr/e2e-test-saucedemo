export interface Account {
    id: string;
    username: string;
    password: string;
}

export const standardUser: Account = {id: 'standard', username: 'standard_user', password: 'secret_sauce'};
export const lockedOutUser: Account = { id: 'lockedOut', username: 'locked_out_user', password: 'secret_sauce' };
export const problemUser: Account = { id: 'problem', username: 'problem_user', password: 'secret_sauce' };
export const performanceGlitchUser: Account = { id: 'performanceGlitch', username: 'performance_glitch_user', password: 'secret_sauce' };
export const errorUser: Account = { id: 'error', username: 'error_user', password: 'secret_sauce' };
export const visualUser: Account = { id: 'visual', username: 'visual_user', password: 'secret_sauce' };

export const accounts: Account[] = [
    standardUser,
    lockedOutUser,
    problemUser,
    performanceGlitchUser,
    errorUser,
    visualUser,
];

export const toTestAfterLogin: Account[] = [standardUser, problemUser, performanceGlitchUser, errorUser, visualUser];