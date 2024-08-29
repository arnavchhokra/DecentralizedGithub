import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Repository from '@/components/Repository'
import Issues from '@/components/Issues'
import Pulls from '@/components/Pulls'


function page() {
  return (
    <div style={{justifyContent:"center"}}>
    <Tabs style={{}}defaultValue="code">
    <TabsList style={{ width:"100%"}}>
      <TabsTrigger value="code">Code</TabsTrigger>
      <TabsTrigger value="issues">Issues</TabsTrigger>
      <TabsTrigger value="pulls">Pull Requests</TabsTrigger>
    </TabsList>
    <TabsContent value="code">
      <Repository/>
    </TabsContent>
    <TabsContent value="issues">
      <Issues/>
    </TabsContent>
    <TabsContent value="pulls">
      <Pulls/>
    </TabsContent>
  </Tabs>
  </div>
  )
}

export default page