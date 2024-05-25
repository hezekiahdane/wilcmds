import React from 'react'
import PostCard from "../components/PostCard";


const Home = () => {
  return (
    <div className="flex justify-center items-center flex-col"> {/* flex-col added */}
      <PostCard />
  </div>
  )
}

export default Home