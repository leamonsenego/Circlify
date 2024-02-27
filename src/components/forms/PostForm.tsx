import * as z from "zod"
import { Models } from "appwrite"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PostValidation } from "@/lib/validation"
import { useToast } from "@/components/ui/use-toast"
import { useUserContext } from "@/context/AuthContext"
import FileUploader from "@/components/shared/FileUploader"
import { Button } from "../ui/button"
import Loader from "../shared/Loader"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"

type PostFormProps = {
  post?: Models.Document
  action: "Create" | "Update"
}
const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useUserContext()
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  })

  // Query
  const { mutateAsync: createPost, isLoading: isLoadingCreate } =
    useCreatePost()
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } =
    useUpdatePost()

  // Handler
  async function handleSubmit (value: z.infer<typeof PostValidation>) {
    // ACTION = UPDATE
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      })

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        })
      }
      return navigate(`/posts/${post.$id}`)
    }

    // ACTION = CREATE
    try {
      console.log("Creating post with payload:", {
        ...value,
        userId: user.id,
      });
    
      const newPost = await createPost({
        ...value,
        userId: user.id,
      });
    
      console.log("API response:", newPost);
    
      if (!newPost) {
        console.error(`${action} post creation failed. API response:`, newPost);
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
    
      navigate("/");
    } catch (error) {
      console.error(`${action} post creation failed. Error:`, error);
    }
  }


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm