import format from "./format.js";

const original = `Hello,
My name is Susan. I'm forteen and I life in Germany. My hobbys are go to discos, sometimes I hear music in the radio. In the summer I go bathing in a lake. I haven't any brothers or sisters. We take busses to scool. I visit year 9 at my school. My birthday is on Friday. I hope I will become a new guitar.
I'm looking forward to get a e-mail from you.

Yours,
Susan`,
    revised = `Hello,
My name is Susan. I am fourteen years old and I live in Germany. My hobbies include going to discos, listening to music on the radio, and going swimming in a lake during the summer. I do not have any brothers or sisters. We take buses to school. I am in year 9 at my school. My birthday is this Friday. I hope to receive a new guitar as a gift.
I am looking forward to receiving an email from you.

Best,
Susan`;

const originalWords = original.split(" "),
    revisedWords = revised.split(" "),
    [longer, shorter] = [originalWords, revisedWords].sort(
        (a, b) => b.length - a.length
    );

console.log(
    format({ original, revised })
    // badLoops()
);

// my original approach. keeping the words in order is a mess
function badLoops() {
    const result = [];
    for (let x = 0; x < longer.length; x++) {
        const wordLong = longer[x];
        for (let y = 0; y < shorter.length; y++) {
            const wordShort = shorter[y];
            if (wordLong === wordShort) {
                const info = {
                    word: wordLong,
                    originalIndex: originalWords === longer ? x : y,
                    revisedIndex: originalWords === longer ? y : x,
                };
                result.push(info);
                break;
            }
        }
    }
    return result;
}
