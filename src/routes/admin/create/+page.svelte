<script lang="ts">
    import QuillJs from "$lib/QuillJS.svelte";
    import { parseHTML } from "$lib/parseHTML";
    import { collectionFuctions } from "$lib/appwrite";

    let docId:string, 
        timeout:number, 
        selectedBlog:string,
        showQuillCheck:boolean

    function onContentChange(htmlContent:string) {
        const { title, body } = parseHTML(htmlContent)

        clearTimeout(timeout);
        timeout = setTimeout(async () => {            
            try {
                if (!docId) {
                    const doc = await collectionFuctions.createDoc(selectedBlog, { title, body })
                    if (doc) docId = doc?.$id                    
                }
                await collectionFuctions.updateDoc(selectedBlog, docId, { title, body })
                showQuillCheck = false
                setTimeout(() => showQuillCheck = true, 0)
            } catch (error) {
                console.error(error)
            }
        }, 2000);
    }
</script>

<h1 class="h1">Create New Post</h1>

<div class="my-20">
    <select class="select select-bordered flex-1 bg-primary text-primary-content font-bold text-center w-96 mx-auto block" bind:value={selectedBlog} >
        <option class="font-bold" disabled selected value="">Select Blog</option>
        <option class="font-bold" value="blogA">Blog A</option>
        <option class="font-bold" value="blogB">Blog B</option>
      </select>
</div>

{#key selectedBlog}
    {#if selectedBlog}
        <QuillJs {showQuillCheck} {onContentChange} />
    {/if}
{/key}