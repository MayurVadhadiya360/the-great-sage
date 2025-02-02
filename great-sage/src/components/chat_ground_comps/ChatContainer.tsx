import React from 'react';
import MessageRoleAssistant from './MessageRoleAssistant';
import MessageRoleUser from './MessageRoleUser';

// Define the interface for the component's props
interface ChatContainerProps {
    chat: Array<{ role: String, message: String }>; // Replace 'any' with a more specific type if available
}

// Annotate the component with the props type
const ChatContainer: React.FC = () => {
    let chat = [
        { role: 'user', message: 'Hello, how are you?' },
        { role: 'assistant', message: 'I am doing well, thank you for asking.' },
        { role: 'user', message: 'That is great to hear.' },
        { role: 'assistant', message: 'Yes, I am feeling quite positive today.' },
        { role: 'user', message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam harum ducimus, magni perspiciatis exercitationem iste quia deleniti quaerat velit, maiores labore, quos obcaecati. Nisi facilis totam eum mollitia animi, dolorum officia, ab neque tenetur repellat officiis provident facere esse quae.' },
        { role: 'assistant', message: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta voluptatem quia atque aspernatur repellat hic odio asperiores, voluptas porro ad eveniet tempore eligendi, dolorum cumque similique sunt unde necessitatibus natus sed, officia omnis? Numquam quae fuga minima voluptatibus aut, assumenda nam quibusdam in expedita corporis similique illo facilis culpa eum minus ipsum illum laudantium debitis maiores earum sed iure nesciunt rerum placeat! Eligendi natus illum saepe aliquid cupiditate perspiciatis impedit modi molestiae. Aperiam excepturi, nesciunt quia voluptatibus quibusdam possimus sapiente rem velit beatae, corrupti voluptatem consequatur veniam quod corporis quasi a libero ab temporibus, atque itaque. Eligendi commodi nisi enim molestias id, earum autem vero iste. Exercitationem facere cumque animi vero modi, ipsa maxime consectetur magnam quos voluptatum, veniam voluptas excepturi qui a. Harum dolor impedit minima mollitia nobis ducimus ipsum explicabo, ex nostrum sint maxime vero error ratione optio blanditiis perspiciatis nemo dolorum quisquam a. Pariatur, totam blanditiis! Id doloribus non cupiditate impedit praesentium cumque assumenda, iste suscipit! Esse assumenda hic iusto voluptates veritatis! In facere fugit esse voluptas ut, eveniet optio? Modi praesentium maiores ab laborum explicabo aut atque. Praesentium eligendi corrupti aliquam magni a sed nobis sequi excepturi maxime numquam officiis odit molestiae voluptate perspiciatis, minus alias sit! Dolorum, provident excepturi? Beatae, similique. Minima recusandae veniam animi voluptates maxime dolore cum natus fuga libero perferendis neque sint illum cupiditate provident unde praesentium eaque aliquid placeat magnam impedit, explicabo similique possimus? Ea quaerat eum facilis corrupti ullam quam numquam suscipit blanditiis inventore quia doloremque quis molestias illum, cum accusantium, at distinctio delectus. Exercitationem earum rem recusandae, temporibus voluptas eveniet, quidem perspiciatis repellat, quod asperiores quisquam minus placeat! Incidunt qui perferendis blanditiis voluptate voluptatem est repellat eligendi nostrum alias fuga provident amet esse nisi error in minus, pariatur, nobis sit nulla adipisci, veniam non quasi aperiam! Iure quidem rem aliquid voluptas labore omnis asperiores recusandae fugit totam. Molestiae, vero provident culpa sed voluptates inventore perferendis? Culpa neque dolore, debitis itaque omnis magnam ad ipsum. Illum nihil aliquam, neque accusamus excepturi unde obcaecati qui labore, aperiam similique consectetur non impedit natus officiis nobis. Vitae, exercitationem! Illo quisquam porro quas, perferendis saepe neque explicabo necessitatibus incidunt distinctio nemo ipsum itaque ducimus earum provident numquam tempora minus dolore vero odit. Dicta, minus dolorem hic ut non sunt veniam inventore quam illum officia adipisci porro soluta id libero molestiae, ducimus eius, dolore ex cum explicabo laborum deserunt veritatis? Explicabo praesentium perferendis iure cumque iusto repellat in ad nisi. Commodi minus rerum, nostrum consequuntur ut saepe, consequatur incidunt provident aliquid nihil deserunt, ratione itaque dolor fugit fugiat placeat suscipit ipsa. Accusamus minus ratione, fuga, inventore expedita maiores hic tempore dolore autem id ex alias corporis, blanditiis necessitatibus? Molestiae, neque ullam deserunt impedit magni facilis magnam labore odit cum ducimus velit nemo quae minima dolore nam ab veniam placeat, explicabo quam quisquam quibusdam. Molestias dolorum voluptates, vero veritatis explicabo minima harum provident, minus eligendi distinctio cum autem! Cupiditate numquam animi laudantium earum tenetur, facilis incidunt voluptate consectetur explicabo. Quis, aspernatur sunt aperiam mollitia velit inventore.' },
    ];
    return (
        <>
            {chat.map(msg => {
                if (msg.role === 'assistant') {
                    return <MessageRoleAssistant message={msg.message} />
                }
                else {
                    return <MessageRoleUser message={msg.message} />
                }
            })}
        </>
    );
};

export default ChatContainer;
