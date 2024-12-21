import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css'; // Import the default styles
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

import {
    FaHandsHelping,
    FaGlobe,
    FaChartLine,
    FaSchool,
    FaWater,
    FaMedal,
} from 'react-icons/fa'; // Import required icons
import timelineEvents from '../data/timelineEvents'; // Import timeline data

export default function Tanzania() {
    // Map of icon strings to actual React components
    const iconMap = {
        FaHandsHelping: <FaHandsHelping />,
        FaGlobe: <FaGlobe />,
        FaChartLine: <FaChartLine />,
        FaSchool: <FaSchool />,
        FaWater: <FaWater />,
        FaMedal: <FaMedal />,
    };

    return (
        <div>
            <Head>
                <title>Roshan Taneja - Tanzania Project</title>
                <meta
                    name="description"
                    content="A timeline of my work in Tanzania, bringing water to the Maasai community."
                />
                <link rel="icon" href="/chevron_left_FILL0_wght400_GRAD0_opsz48.ico" />
            </Head>

            <main>
                <a href="/" className={styles.backLink}> &larr; Back to Home</a>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    Bringing Water to the Maasai of Tanzania
                </h1>

                <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.2rem' }}>
                    A detailed timeline of my efforts to bring clean water access to the Maasai
                    community through fundraising, deploying rainwater harvesting units, and
                    leveraging satellite technology for sustainable solutions.
                </p>

                <VerticalTimeline>
                    {timelineEvents.map((event, index) => (
                        <VerticalTimelineElement
                            key={index}
                            date={event.date}
                            iconStyle={{ background: '#0070f3', color: '#fff' }}
                            icon={iconMap[event.icon]} // Dynamically assign icons
                        >
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                        </VerticalTimelineElement>
                    ))}
                </VerticalTimeline>
                <SpeedInsights/>
                <Analytics/>
            </main>

            <footer style={{ textAlign: 'center', padding: '2rem 0' }}>
                Roshan Taneja &copy; all rights reserved.
            </footer>
        </div>
    );
}