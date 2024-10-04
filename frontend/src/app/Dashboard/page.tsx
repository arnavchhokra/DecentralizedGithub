"use client";

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import RepoDashboard from '@/components/RepoDashboard';
import { Button } from '@/components/ui/button';
import contractABI from '@/components/contractABI';

const contractAddress = "0xddEc11C12559a6cBCb1A2c845FF14530818129A4";

interface Repository {
  repoID: string;
  name: string;
  ipfsCid: string;
  owner: string;
}

const Page = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepositories = async () => {
 //     const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
   //   const contract = new web3.eth.Contract(contractABI, contractAddress);

      try {
    //    const accounts = await web3.eth.getAccounts();
     //   const userAddress = accounts[0];

        // Fetch repository details
      //  const repos: Repository[] = await contract.methods.getUserRepositoryIDs(userAddress).call();

        // Directly use repos as Repository[] after type assertion
      //  setRepositories(repos);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: 'column', alignItems: "center", padding: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
        <span style={{ fontSize: "25px", fontWeight: "600" }}>Your Repositories</span>
        <Button onClick={() => { location.href = 'Repo/add'; }}>New Repository</Button>
      </div>
      <div style={{ width: "80%", marginTop: "30px" }}>
        {repositories.length > 0 ? (
          repositories.map((repo) => (
            <RepoDashboard
              key={repo.repoID}
              title={repo.name}
              description={repo.ipfsCid}
              creatorAddress={repo.owner}
              link={`/Repo/${repo.repoID}`}
            />
          ))
        ) : (
          <div>No repositories found.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
