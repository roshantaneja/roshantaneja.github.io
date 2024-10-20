import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function Tanzania() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Roshan Taneja - Tanzania Project</title>
                <meta name="description" content="A timeline of my work in Tanzania, bringing water to the Maasai community." />
                <link rel="icon" href="/chevron_left_FILL0_wght400_GRAD0_opsz48.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Bringing Water to the <a href="https://en.wikipedia.org/wiki/Maasai_people" target="_blank" rel="noopener noreferrer">Maasai</a> of Tanzania
                </h1>

                <p className={styles.description}>
                    A detailed timeline of my efforts to bring clean water access to the Maasai community through fundraising, deploying rainwater harvesting units, and leveraging satellite technology for sustainable solutions.
                </p>

                <div className={styles.timelineContainer}>
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>Dec 2020</div>
                        <div className={styles.timelineContent}>
                            <h3>First Fundraising Effort</h3>
                            <p>Raised $20K through phone calls, emails, and outreach for the first rainwater harvesting unit.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>Dec 2021</div>
                        <div className={styles.timelineContent}>
                            <h3>First Visit to Tanzania</h3>
                            <p>Visited the site for the first rainwater harvesting unit and walked with Joseph, a local Maasai tribesman, to understand the community's challenges firsthand.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>June 2022</div>
                        <div className={styles.timelineContent}>
                            <h3>Second Round of Fundraising</h3>
                            <p>Launched another round of fundraising, raising $27K and engaging more families to join the effort.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>Dec 2022</div>
                        <div className={styles.timelineContent}>
                            <h3>Surveying the Maasai Community</h3>
                            <p>Brought six students to Losimingori to survey the Maasai community and assess the impact of the rainwater harvesting unit.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>Feb 2023</div>
                        <div className={styles.timelineContent}>
                            <h3>Deployment of Three More Units</h3>
                            <p>Deployed three additional rainwater harvesting units, further expanding the reach of the project.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>April 2023</div>
                        <div className={styles.timelineContent}>
                            <h3>Speech in Arusha</h3>
                            <p>Spoke in front of 600+ people at a conference in Arusha, discussing the project’s impact on the Maasai community.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>June 2023</div>
                        <div className={styles.timelineContent}>
                            <h3>Impact Summary</h3>
                            <p>Summarized the impact of the deployed units and began sharing the results more broadly to gain further support.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>Oct 2023</div>
                        <div className={styles.timelineContent}>
                            <h3>Involving Middle Schoolers</h3>
                            <p>Engaged middle school students in fundraising efforts to expand the reach of the project.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>Nov 2023</div>
                        <div className={styles.timelineContent}>
                            <h3>Bay Area Panel</h3>
                            <p>Participated in a panel with 40 people in the Bay Area to discuss the work and future goals for the project.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>Dec 2023 / Spring 2024</div>
                        <div className={styles.timelineContent}>
                            <h3>Remote Sensing Studies</h3>
                            <p>Studied remote sensing, satellite imaging, and related technologies to enhance project outcomes.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>June 2024</div>
                        <div className={styles.timelineContent}>
                            <h3>Deployment of 10 Tanks</h3>
                            <p>Deployed 10 more 5000-liter tanks, expanding the program to involve more families and students.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>Aug 2024</div>
                        <div className={styles.timelineContent}>
                            <h3>Third Fundraising Round</h3>
                            <p>Raised $40K in the third round of fundraising through multiple pitches to families and supporters.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>Sept/Oct 2024</div>
                        <div className={styles.timelineContent}>
                            <h3>Deployment Plan for 100 Units</h3>
                            <p>Started the project to deploy 100 rainwater units in zones identified through satellite image maps.</p>
                        </div>
                    </div>

                    <div className={styles.timelineItem}>
                        <div className={styles.timelineDate}>Dec 2024</div>
                        <div className={styles.timelineContent}>
                            <h3>Completion of 100 Unit Deployment</h3>
                            <p>Successfully completed the deployment of 100 rainwater units, providing sustainable water access to the Maasai community.</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                Roshan Taneja &copy; all rights reserved.
            </footer>
        </div>
    )
}