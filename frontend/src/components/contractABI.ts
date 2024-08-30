const contractABI = [
    
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "commitHash",
                    "type": "bytes32"
                }
            ],
            "name": "CommitPushed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "issueIndex",
                    "type": "uint256"
                }
            ],
            "name": "IssueClosed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "issueIndex",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                }
            ],
            "name": "IssueCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "prIndex",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "sourceCommitHash",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "targetCommitHash",
                    "type": "bytes32"
                }
            ],
            "name": "PullRequestCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "prIndex",
                    "type": "uint256"
                }
            ],
            "name": "PullRequestMerged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "ipfsCid",
                    "type": "string"
                }
            ],
            "name": "RepositoryCreated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint256",
                    "name": "issueIndex",
                    "type": "uint256"
                }
            ],
            "name": "closeIssue",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                },
                {
                    "internalType": "string",
                    "name": "_description",
                    "type": "string"
                },
                {
                    "internalType": "bytes32",
                    "name": "contentHash",
                    "type": "bytes32"
                }
            ],
            "name": "createIssue",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "sourceCommitHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "targetCommitHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "prContentHash",
                    "type": "bytes32"
                }
            ],
            "name": "createPullRequest",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_ipfsCid",
                    "type": "string"
                }
            ],
            "name": "createRepository",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                }
            ],
            "name": "getCommitHashes",
            "outputs": [
                {
                    "internalType": "bytes32[]",
                    "name": "",
                    "type": "bytes32[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                }
            ],
            "name": "getIssues",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "creator",
                            "type": "address"
                        },
                        {
                            "internalType": "bool",
                            "name": "isOpen",
                            "type": "bool"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "contentHash",
                            "type": "bytes32"
                        }
                    ],
                    "internalType": "struct DecentralizedGit.Issue[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                }
            ],
            "name": "getPullRequests",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "bytes32",
                            "name": "sourceCommitHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "targetCommitHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bool",
                            "name": "isMerged",
                            "type": "bool"
                        },
                        {
                            "internalType": "address",
                            "name": "creator",
                            "type": "address"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "prContentHash",
                            "type": "bytes32"
                        }
                    ],
                    "internalType": "struct DecentralizedGit.PullRequest[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint256",
                    "name": "prIndex",
                    "type": "uint256"
                }
            ],
            "name": "mergePullRequest",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "repoId",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "commitHash",
                    "type": "bytes32"
                }
            ],
            "name": "pushCommit",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "repositories",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "ipfsCid",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "userRepos",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "ipfsCid",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
];

export default contractABI;