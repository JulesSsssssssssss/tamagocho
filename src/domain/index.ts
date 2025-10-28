// Entities
export { Tamagotchi } from './entities'
export { Wallet } from './entities/Wallet'
export { Transaction, TRANSACTION_AMOUNTS } from './entities/Transaction'

// Types
export type { ITamagotchiStats } from './entities'
export type { WalletProps } from './entities/Wallet'
export type { TransactionProps, TransactionType, TransactionReason } from './entities/Transaction'

// Repositories
export type { ITamagotchiRepository } from './repositories'
export type { IWalletRepository, ITransactionRepository, IWalletService } from './repositories/IWalletRepository'
