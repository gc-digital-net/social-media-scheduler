import { PostComposer } from '@/components/composer/post-composer'

export default function ComposePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Post</h1>
        <p className="text-muted-foreground">
          Craft your message and schedule it across multiple platforms
        </p>
      </div>
      
      <PostComposer />
    </div>
  )
}