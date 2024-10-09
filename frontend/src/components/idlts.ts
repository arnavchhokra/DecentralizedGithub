// Create a new file: types/types.ts

import { web3 } from '@project-serum/anchor';

export type idlts = {
  "version": "0.1.0",
  "name": "solana_github",
  "instructions": [
    {
      "name": "initUser",
      "accounts": [
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    // Add other instructions as needed
  ],
  "accounts": [
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "lastRepoId",
            "type": "u8"
          },
          {
            "name": "repoCount",
            "type": "u8"
          },
          {
            "name": "lastPullId",
            "type": "u8"
          },
          {
            "name": "pullCount",
            "type": "u8"
          }
        ]
      }
    }
    // Add other accounts as needed
  ]
};

