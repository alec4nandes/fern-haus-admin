import { useRef } from "react";

export default function IdTitlesImage({ post, postIdRef }) {
    const titleRef = useRef(),
        captionRef = useRef();

    function handleSlugifyTitle(e) {
        e.preventDefault();
        const title = titleRef.current.value,
            slug = title.trim().toLowerCase().replaceAll(" ", "-");
        postIdRef.current.value = slug;
    }

    function handleFormatCaption(e) {
        e.preventDefault();
        const caption = captionRef.current.value,
            formatted = caption.trim().replaceAll("<a ", `<a target="_blank" `);
        captionRef.current.value = formatted;
    }

    return (
        <>
            <label htmlFor="post-id">post id:</label>
            <input
                ref={postIdRef}
                id="post-id"
                name="post_id"
                defaultValue={post.post_id}
                required
            />
            <button onClick={handleSlugifyTitle}>slugify title for ID</button>
            <label htmlFor="title">title:</label>
            <input
                ref={titleRef}
                id="title"
                name="title"
                defaultValue={post.title}
                required
            />
            <label htmlFor="subtitle">subtitle:</label>
            <input id="subtitle" name="subtitle" defaultValue={post.subtitle} />
            <label htmlFor="feature-image-path">feature image path:</label>
            <input
                id="feature-image-path"
                name="feature_image"
                defaultValue={post.feature_image}
            />
            <label htmlFor="feature-image-caption">
                feature image caption:
            </label>
            <input
                ref={captionRef}
                id="feature-image-caption"
                name="feature_image_caption"
                defaultValue={post.feature_image_caption}
            />
            <button onClick={handleFormatCaption}>format caption</button>
            <label htmlFor="feature-image-alt">feature image alt:</label>
            <input
                id="feature-image-alt"
                name="feature_image_alt"
                defaultValue={post.feature_image_alt}
            />
        </>
    );
}
