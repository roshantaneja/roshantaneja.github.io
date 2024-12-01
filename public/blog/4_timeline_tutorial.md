---
title: How to make a timeline in Next.js
date: 11-29-2024
description: a tutorial (with codeblocks!) on how to build the timeline you see on the homepage
---

# Building an Interactive Timeline for My Tanzania Project

One of the most exciting aspects of sharing my work on the Tanzania project is showcasing its progress over the years. To make it engaging, I created a dynamic, interactive timeline using **React**, **Next.js**, and the _react-vertical-timeline-component_ library.

In this post, I’ll walk you through how this timeline works, including its structure, dynamic data handling, and the visual elements that bring it to life.

---

## Why a Timeline?

Timelines are a powerful way to present sequential events. For my Tanzania project, the timeline highlights:
* Fundraising efforts.
* Deployment of rainwater harvesting units.
* Community engagement milestones.
* The integration of technology and satellite imagery into the project.

The goal was to make the timeline not just informative but also visually appealing and interactive.

---

## Key Technologies

To build this timeline, I used:
* **Next.js:** A React framework for server-side rendering and static site generation.
* **react-vertical-timeline-component:** A library specifically designed for creating vertical timelines.
* **react-icons:** A library for adding icons to represent different milestones.

---

## Step-by-Step Breakdown

### 1. Organizing Data with a timelineEvents File

The timeline’s data is stored in a separate timelineEvents.js file. This keeps the content modular and easy to update.

Here’s an example of one timeline event:

```js
const timelineEvents = [
    {
        date: 'Dec 2020',
        title: 'First Fundraising Effort',
        description: 'Raised $20K through phone calls, emails, and outreach for the first rainwater harvesting unit.',
        icon: 'FaHandsHelping', // Icon name as a string
    },
    // More events...
];


export default timelineEvents;
```

Each event includes:
* date: The date of the milestone.
* title: A brief title for the event.
* description: Detailed information about the milestone.
* icon: A string that maps to a React icon.

---

### 2. Dynamic Rendering in Tanzania.js

The timeline component (Tanzania.js) dynamically maps over the timelineEvents data to render the timeline.

Mapping Icons Dynamically

Icons are dynamically assigned based on the icon string in each event. A iconMap object maps the string to actual React components:

```js
import { FaHandsHelping, FaGlobe, FaChartLine, FaSchool, FaWater } from 'react-icons/fa';

const iconMap = {
    FaHandsHelping: <FaHandsHelping />,
    FaGlobe: <FaGlobe />,
    FaChartLine: <FaChartLine />,
    FaSchool: <FaSchool />,
    FaWater: <FaWater />,
};
```

When rendering the timeline, the icon property of each event is used to fetch the corresponding icon from iconMap:

```js
<VerticalTimelineElement
    key={index}
    date={event.date}
    icon={iconMap[event.icon]} // Dynamically map icon
>
    <h3>{event.title}</h3>
    <p>{event.description}</p>
</VerticalTimelineElement>
```

---

### 3. Visual Design with react-vertical-timeline-component

The timeline leverages the default styles of the react-vertical-timeline-component library. Each timeline element uses:
* VerticalTimelineElement: To represent a milestone.
* iconStyle: To style the icon for each event.

For example:

```js
<VerticalTimelineElement
    date="Dec 2020"
    iconStyle={{ background: '#0070f3', color: '#fff' }}
    icon={<FaHandsHelping />}
>
    <h3>First Fundraising Effort</h3>
    <p>Raised $20K through phone calls and emails.</p>
</VerticalTimelineElement>
```

The result is a clean, professional look with:
* Circular icons for each milestone.
* Dates aligned on the left.
* Event descriptions and titles on the right.

---

### 4. Custom Styling

To make the timeline visually consistent with the rest of the site, I customized the default styles.

Example Customization

```css
.vertical-timeline-element-content {
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

.vertical-timeline-element-content h3 {
    font-size: 1.2rem;
    color: #333;
}
```

This ensures that each event looks polished while maintaining consistency with the site’s overall design.

---

### 5. Adding a Responsive Footer

Finally, I added a simple footer to wrap up the timeline:

```js
<footer style={{ textAlign: 'center', padding: '2rem 0' }}>
    Roshan Taneja &copy; all rights reserved.
</footer>
```

---

## Final Result

The final timeline dynamically renders all milestones, each with its own icon and description. The interactive design and polished layout make it a perfect way to showcase the progress of my Tanzania project.

---

## Lessons Learned

While building this timeline, I learned:
* How to separate content and logic for better maintainability.
* The power of using external libraries like react-vertical-timeline-component to save time and enhance the user experience.
* The importance of responsive design and consistent styling.

---

## What’s Next?

In the future, I plan to:
* Add filters to sort events by category (e.g., fundraising, deployments, technology).
* Include links within events to more detailed blog posts or images.

If you’re working on a project with a story to tell, I highly recommend using this approach to create a visually engaging timeline. It’s a great way to share milestones and progress with your audience.

---

Let me know if you found this post helpful or if you have any questions about implementing a similar timeline!