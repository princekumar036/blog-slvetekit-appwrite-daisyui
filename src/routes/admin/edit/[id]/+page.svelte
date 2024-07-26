<script lang="ts">
    import  type { Models } from 'appwrite'
    import QuillJs from "$lib/QuillJS.svelte";
    import { parseHTML } from "$lib/parseHTML";
    import { collectionFuctions, collMapper } from "$lib/appwrite";
    import { page } from "$app/stores";

    const selectedBlog = $page.url.searchParams.get('blog')
    const docId = $page.params.id

    let post:Models.Document
    collMapper.find(item => item.name === selectedBlog)?.store.subscribe(
        posts => post = posts.find(item => item.$id === docId)
    );    


    let timeout:number,
        showQuillCheck:boolean = false

    function onContentChange(htmlContent:string) {
        const { title, body } = parseHTML(htmlContent)

        clearTimeout(timeout);
        timeout = setTimeout(async () => {            
            try {
                await collectionFuctions.updateDoc(selectedBlog, docId, { title, body })
                showQuillCheck = false
                setTimeout(() => showQuillCheck = true, 0)
            } catch (error) {
                console.error(error)
            }
        }, 2000);
    }
</script>

<h1 class="h1">Edit Post</h1>

{#if post}
    <QuillJs preLoadContent={post.title + post.body} {onContentChange} {showQuillCheck} />
{/if}
