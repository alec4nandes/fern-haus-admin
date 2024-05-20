import { useEffect, useRef } from "react";

export default function CategoriesTagsDate({ post }) {
    const dateRef = useRef(),
        changeDateRef = useRef();

    useEffect(() => {
        dateRef.current.value = changeDate(post.date, true);
        changeDateRef.current.value = changeDate(post.date);
    }, [post]);

    return (
        <>
            <label htmlFor="categories">categories:</label>
            <input
                id="categories"
                name="categories"
                defaultValue={post.categories?.join(", ")}
                required
            />
            <label htmlFor="tags">tags:</label>
            <input id="tags" name="tags" defaultValue={post.tags?.join(", ")} />
            <input
                ref={dateRef}
                name="date"
                type="text"
                defaultValue={post.date}
                hidden
            />
            <label htmlFor="change-date">date:</label>
            <input
                ref={changeDateRef}
                id="change-date"
                type="datetime-local"
                onChange={(e) => {
                    dateRef.current.value = changeDate(e.target.value, true);
                }}
            />
        </>
    );
}

// GLOBAL FUNCTIONS

function changeDate(date, addTimezone) {
    const localDate = date ? new Date(date) : new Date(),
        pad = (num) => ("" + num).padStart(2, "0"),
        mm = pad(localDate.getMonth() + 1),
        dd = pad(localDate.getDate()),
        yyyy = pad(localDate.getFullYear()),
        hh = pad(localDate.getHours()),
        mi = pad(localDate.getMinutes()),
        parsed = `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    return parsed + (addTimezone ? getTZOffset(parsed) : "");
}

function getTZOffset(timestamp) {
    const minutesOffset = new Date(timestamp).getTimezoneOffset(),
        hours = minutesOffset / 60,
        // minutesOffset reflects how far ahead GMT is,
        // therefore invert it to get your timezone relative to GMT
        num = hours * -1,
        prefix = num >= 0 ? "+" : "-",
        offset = ("" + Math.abs(num)).padStart(2, "0");
    return prefix + offset + ":00";
}
