<script lang="ts">
  import  type { Models } from 'appwrite'
  import { collectionFuctions, collMapper } from "$lib/appwrite"
  import { parseHTML } from "$lib/parseHTML"

  const selectedBlog = 'Blog A'
  const collection = collMapper.find(item => item.name === selectedBlog)
  let posts:Models.Document[]
  collection?.store.subscribe(val => posts = val)

  async function handleDelete(id: string, title: string) {
      const response = confirm(`Delete Post? \n\n${title}`)
      if (response) {
          await collectionFuctions.deleteDoc(selectedBlog, id)
      }
  }
</script>

<h1 class="h1">{collection?.name}</h1>

<div class="overflow-x-auto">
  <table class="table">
    <thead>
      <tr>
        <th>Sl. No.</th>
        <th>Image</th>
        <th>Title</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each posts as post, i}
        <tr class="hover">
          <th>{i + 1}</th>
          <td
            ><img
              src={parseHTML(post.body).heroImg || "/placeholder.png"}
              alt=""
              class="w-20"
            /></td
          >
          <td>{post?.title}</td>
          <td
            ><a class="btn btn-sm btn-accent" href="/admin/edit/{post.$id}?blog={selectedBlog}"
              >Edit</a
            ></td
          >
          <td
            ><button
              class="btn btn-sm btn-error"
              on:click={() => handleDelete(post.$id, post.title)}>Delete</button
            ></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>