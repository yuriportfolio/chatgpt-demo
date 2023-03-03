import { createSignal, For, Show } from "solid-js";
import MessageItem from "./MessageItem";
import IconClear from "./icons/Clear";
import type { ChatMessage } from "../types";

interface UserExperience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface JobDescription {
  title: string;
  description: string;
}

interface Resume {
  name: string;
  email: string;
  phone: string;
  experience: UserExperience[];
  education: string[];
  skills: string[];
  achievements: string[];
  certifications: string[];
  languages: string[];
}

const generateResume = (jobDescription: JobDescription, userExperience: UserExperience[]): Resume => {
  // Use the job description and user's experience to generate a resume
  // ...
  // Return the generated resume
  return {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    experience: [
      {
        position: "Software Developer",
        company: "ABC Corp",
        startDate: "Jan 2018",
        endDate: "Present",
        description: "Developed web applications using React and Node.js",
      },
      {
        position: "Junior Software Developer",
        company: "XYZ Corp",
        startDate: "Sep 2016",
        endDate: "Jan 2018",
        description: "Worked on a team developing a mobile app using React Native",
      },
    ],
    education: ["Bachelor of Science in Computer Science"],
    skills: ["React", "Node.js", "JavaScript", "TypeScript"],
    achievements: ["Won second place in a hackathon", "Published an article in a tech blog"],
    certifications: ["AWS Certified Developer"],
    languages: ["English", "Spanish"],
  };
};

export default () => {
  let inputRef: HTMLInputElement;
  const [messageList, setMessageList] = createSignal<ChatMessage[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleButtonClick = async () => {
    const inputValue = inputRef.value;
    if (!inputValue) {
      return;
    }
    setLoading(true);
    // @ts-ignore
    if (window?.umami) umami.trackEvent("chat_generate");
    inputRef.value = "";
    setMessageList([
      ...messageList(),
      {
        role: "user",
        content: inputValue,
      },
    ]);

    const input = JSON.parse(inputValue);
    const jobDescription: JobDescription = input.jobDescription;
    const userExperience: UserExperience[] = input.userExperience;

    const resume = generateResume(jobDescription, userExperience);
    setCurrentAssistantMessage(`Here's a resume tailored for the ${jobDescription.title} position: ${JSON.stringify(resume)}`);

    setMessageList([
      ...messageList(),
      {
        role: "assistant",
        content: currentAssistantMessage(),
      },
    ]);
    setCurrentAssistantMessage("");
    setLoading(false);
  };

  const clear = () => {
    inputRef.value = "";
    setMessageList([]);
    setCurrentAssistantMessage("");
  };

  return (
  <div my-6>
    <For each={messageList()}>{(message) => <MessageItem role={message.role} message={message.content} />}</For>
    {currentAssistantMessage() && <MessageItem role="assistant" message={currentAssistantMessage} />}
    <div class="my-4 flex items-center gap-2">
      <div class="mr-2 text-slate">Please enter a job description and your work experience:</div>
      <input
        ref={inputRef!}
        type="text"
        id="input"
        placeholder='{"jobDescription": {"title": "Software Developer", "description": "Develops and maintains software applications"}, "userExperience": [{"position": "Software Developer", "company": "ABC Corp", "startDate": "Jan 2018", "endDate": "Present", "description": "Developed web applications using React and Node.js"}, {"position": "Junior Software Developer", "company": "XYZ Corp", "startDate": "Sep 2016", "endDate": "Jan 2018", "description": "Worked on a team developing a mobile app using React Native"}]}'
        autocomplete="off"
        autoFocus
        disabled={loading()}
        onKeyDown={(e) => {
          e.key === "Enter" && !e.isComposing && handleButtonClick();
        }}
        w-full
        px-4
        h-12
        text-slate
        rounded-sm
        bg-slate
        bg-op-15
        focus:bg-op-20
        focus:ring-0
        focus:outline-none
        placeholder:text-slate-400
        placeholder:op-30
      />
      <button
        onClick={handleButtonClick}
        disabled={loading()}
        h-12
        px-4
        py-2
        bg-slate
        bg-op-15
        hover:bg-op-20
        text-slate
        rounded-sm
      >
        Generate Resume
      </button>
      <button
        title="Clear"
        onClick={clear}
        disabled={loading()}
        h-12
        px-4
        py-2
        bg-slate
        bg-op-15
        hover:bg-op-20
        text-slate
        rounded-sm
      >
        <IconClear />
      </button>
    </div>
    <Show when={!loading()}>
      <div class="h-12 my-4 flex items-center justify-center bg-slate bg-op-15 text-slate rounded-sm">
        {loading() ? "Generating resume..." : ""}
      </div>
    </Show>
  </div>
)
}
