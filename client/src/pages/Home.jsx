import Sidebar from "@/components/Sidebar"

const Home = () => {
  return (
    <div className="flex">
    <Sidebar/>
    <div className="flex-1 p-8 bg-gray-100 text-gray-500">
        <h1 className="text-2xl font-bold">Dashboard Content</h1>
        {/* You can render content here */}
      </div>
    </div >
  )
}
export default Home