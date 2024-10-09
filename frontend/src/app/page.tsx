import React from 'react'
import Hero from '@/components/Hero'
import { Testimonials1 } from '@/components/Testimonial'
import {FAQ} from '@/components/FAQ'
import { Stats2 } from '@/components/Stats'

function page() {
  return (
    <div>
      <Hero/>
      <Testimonials1/>
      <FAQ/>
      <Stats2/>

    </div>
  )
}

export default page