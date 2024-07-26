<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Icon from "@iconify/svelte";

    export let preLoadContent = "";
    export let onContentChange;
    export let showQuillCheck

    let editor: any;
    let editorElement: HTMLDivElement;

    onMount(async () => {
        try {
            // LOAD QUILLJS
            await loadStylesheet(
                "https://cdn.quilljs.com/1.3.6/quill.snow.css",
            );
            await loadScript("https://cdn.quilljs.com/1.3.6/quill.min.js");
            // LOAD QUILLJS MARKDOWN
            // await loadStylesheet("https://cdn.jsdelivr.net/npm/quilljs-markdown@latest/dist/quilljs-markdown-common-style.css")
            await loadScript(
                "https://cdn.jsdelivr.net/npm/quilljs-markdown@latest/dist/quilljs-markdown.js",
            );
            initQuill();
        } catch (error) {
            console.error("Failed to load Quill:", error);
        }
    });

    const initQuill = () => {
        editor = new window.Quill(editorElement, {
            theme: "snow",
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, 4, false] }],
                    ["bold", "italic", "underline"],
                    [{ align: [] }],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { list: "check" },
                    ],
                    ["link", "image", "video"],
                    ["clean"],
                ],
            },
            placeholder: "Start writing here...",
        });
        const quillMarkdown = new QuillMarkdown(editor);

        editor.on("text-change", () => {
            let htmlContent = editor.root.innerHTML;
            if (!htmlContent.startsWith("<h1>")) {
                editor.formatLine(1, 2, { header: 1 });
            }
            if (onContentChange) {
                onContentChange(htmlContent);
            }
        });

        editor.root.innerHTML = preLoadContent;
    };

    onDestroy(() => {
        if (editor) {
            editor.off("text-change");
            const toolbar = document.querySelector(".ql-toolbar");
            if (toolbar) {
                toolbar.remove();
            }
            editor = null;
        }
        if (editorElement) {
            editorElement.innerHTML = "";
            editorElement.remove()
        }
    });

    // HELPER FUNCTIONS
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    function loadStylesheet(href) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`link[href="${href}"]`)) {
                resolve();
                return;
            }
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
</script>

<div class="relative">
    <div bind:this={editorElement} />
    {#if showQuillCheck}
        <div class="QuillCheck absolute top-3 right-5 text-primary flex items-center gap-3">
            <span class="text-sm">Saved</span>
            <Icon class="inline text-lg" icon="line-md:check-all" />
        </div>
    {/if}
</div>

<style global>
    :root {
        --bg-color: #f0f0f0;
        --text-color: #252525;
    }
    :global(.ql-container) {
        min-height: 300px;
        background: var(--bg-color);
        @apply rounded-b-lg;
        color: var(--text-color);
        font-size: larger !important;
    }

    :global(.ql-toolbar) {
        @apply rounded-t-lg;
        background: var(--bg-color);
    }
</style>
