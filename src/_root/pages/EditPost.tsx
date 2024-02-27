import PostForm from "@/components/forms/PostForm"
import ADD_POST_IMG from "/assets/icons/add-post.svg"
import { useParams } from "react-router-dom"
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/components/shared/Loader"


const EditPost = () => {
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id  || "")

  if(isPending) return <Loader/>

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src={ADD_POST_IMG} alt="add post" width={36} height={36}/>
          <h2 className="h3-bold md:h2-bold text-left w-full"> Edit Post </h2>
        </div>

        <PostForm action="Update" post={post}/>
      </div>
    </div>
  )
}

export default EditPost