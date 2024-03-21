import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function Resume() {
    return (
    <>
    <Head>
        <title>Resume</title>
        <meta name="description" content="My Resume?" />
        <link rel="icon" href="/chevron_left_FILL0_wght400_GRAD0_opsz48.ico" />
    </Head>

    <main classname={styles.main}>
        <div class="divTable">
        <div class="divTableBody">
            <div class="divTableRow">
                <div class="divTableCell">
                    <h1 classname={styles.title} > Roshan Taneja</h1>
                    <h4>Aspiring Humanitarian, Software Engineer, Student, and Brother.</h4>
                </div>
                <div class="divTableCell">
                    <p>(650) 660-1901</p>
                    <p><a href="mailto:rytaneja@gmail.com"> rytaneja@gmail.com </a></p>
                    <p><a href="https://roshan.codes/"> roshan.codes </a></p>
                </div>
            </div>
        <div class="divTableRow">
        <div class="divTableCell">
            <h1>EDUCATION</h1>
                <h2>Sacred Heart Preparatory Atherton [AUG 2021 - PRESENT]</h2>
                    <p>Sophomore: Precalculus BC Hon ors, Chemistry Honors, AP Computer Science .3.95/4.0 GPA</p>
                <h2>Duke University, Residential Summer Program [JULY 2022]</h2>
                    <p>Global Mathematics: Residential program for mathematics and computer science. Built projects centered around graph optimization and search algorithms.{" "} [ <a href="https://github.com/Daroshi11260/Python-Hill-Cipher-Challenge"> https://github.com/Daroshi11260/Python-Hill-Cipher-Challenge </a> ]</p>
                <h2>Center for Talented Youth, John Hopkins University [2020, 2022]</h2>
                    <p>Completed Algebra 2/Trigonometry, Data Structures and Algorithms</p>
            <h1>PROJECTS</h1>
                <h2>SHP Robotics [AUGUST 2021 - PRESENT]</h2>
                    <p>Hardware for robotics teams on campus competing at State and Regional levels for 3 years and continuing as a team captain in 2024/25. Built robots 2021-2024 requiring use of CAD, 3D printing, Lathe, laser cutting, that reached Regional Competitions.</p>
                <h2>Authorship Detection [APR 2023]</h2>
                    <p>Heavily influenced by Word2Vec (developed by Google), produced my own text vectorization software, uses several metrics to vectorize text and compare to celebrity authors and their works. Will be implementing as a python library in the near future</p>
                <h2>Reinforcement Learning based gaming [AUG 2022]</h2>
                    <p>Developed a reinforcement learning-based algo to beat space invaders. Incorporated gym-keras and tensorflow to train slim model on limited moveset. Able to complete the first 2 levels of Space invaders without any points lost. [ <a href="https://github.com/Daroshi11260/spaceinvaders-reinforcementlearning">https://github.com/Daroshi11260/spaceinvaders-reinforcementlearning</a> ]</p>
                <h2>President, Student Board, Maji Wells - Tanzania Maasai Community [Dec 2020 - PRESENT]</h2>
                    <p>Over the last 4 years worked with 6 organizations globally to fundraise $60,000 and plan, design and deploy multiple water harvesting units for 4500 Maasai tribe members in Losimingori, Tanzania. Motivated and led5additional studentsto join the movement and volunteer to fundraise and conduct on ground work. Invited to speak at the East Africa Lions Club Conference MDCON 23 [Arusha, April 2023] in recognition for the work.</p>
                <h2>Water Harvesting Units &amp; Community Center in Tanzania [AUG 2019 - PRESENT]</h2>
                    <p>Painted and prepared the Tanzania community center,{" "} conducted 40+ on ground interviews, and completed three projects between Nov 2022-Feb 2023. Results of impact{" "} <a href="https://docs.google.com/document/d/e/2PACX-1vQzWwLmFh26Uf6EQNTCSs_DbSHbBnPmThD_LozPHY45ctze3Bi5KNun5hD9wDK9Rfj_HOpynlrNOwXe/pub"> documented and published </a> , including rcognization at Google Arts &amp; Culture and Karimu{" "} Working in collaboration with [ <a href="https://projectfuel.in"> Project FUEL</a>, <a href="www.karimufoundation.org">Karimu Foundation</a>, <a href="https://e-clubhouse.org/sites/arusha/index.php">Lions Club of Arusha</a> ].</p>
            <h1>WORK EXPERIENCE</h1>
                <h2>Calabazas Cyclery [Aug 2022 - Dec 2022, part-time]</h2>
                    <p>Started as a volunteer and moved to paid employees managing inventory, grew online presence, and drove on-floor sales. Created websites: [ <a href="https://calabazascyclery.com">calabazascyclery.com</a>, <a href="https://www.google.com/url?q=https://www.usboss.bike&amp;sa=D&amp;source=editors&amp;ust=1686707461544938&amp;usg=AOvVaw3IjQ6EqEnlPHmItPVLbHFH"> usboss.bike</a> ]</p>
                <h2>Building websites for Non-For-Profits</h2>
                    <p>Build and maintain websites for Non-Profit organizationsin Tanzania and local artists</p>
                    <p>[ <a href="https://www.afyayakom.org"> afyayakom.org</a> | <a href="www.artbygeetataneja.com">artbygeetataneja.com</a> ]</p>
        </div>
        <div class="divTableCell">
            <h1>LEADERSHIP</h1>
                <p>Class Officer, Spirit Chair [2023-24]</p>
                <p>Hardware at SHP Robotics [2021-present]</p>
                <p>President, Student Board,Maji Wells [2021-present]</p>
                <p>Researcher &amp; Volunteer, Project FUEL [2020-present]</p>
                <p>Invited speaker, Lions Club MDCON23, Arusha, Tanzania</p>
            <h1>AWARDS</h1>
                <p>Lions Club Melvin Jones Award [May 2023]</p>
                <p>Rotary Scholastic Award for Excellence in Computer Science [May 2023]</p>
                <p>9th in Northern California Regional FTC Robotics [Mar 2022]</p>
                <p>Ranked 3rd/2nd in National Hackathon [2019/2018] TheCoderSchool</p>
            <h1>SKILLS</h1>
                <p><b>Languages:</b> Java, Python, Django, Mojo, Javascript, C++, PHP, DiscordJS, Jupyter, Colab</p>
                <p><b>Softwares:</b> CAD (F360), PrusaSlicer, Vscode, Jetbrains, Fleet</p>
            <h1>SOCIALS</h1>
                <p>GitHub: <a href="https://github.com/Daroshi11260"> github.com/Daroshi11260 </a></p>
                <p>LN: <a href="https://www.linkedin.com/in/roshan-taneja/"> linkedin.com/in/roshan-taneja </a></p>
                <p>Stck: <a href="https://roshantaneja.stck.me/"> roshantaneja.stck.me </a></p>
                <p>Email: <a href="mailto:rytaneja@gmail.com"> rytaneja@gmail.com </a></p>
                <p>Web: <a href="https://roshan.codes"> roshan.codes </a></p>
                <p>Phone: (650) - 660 - 1901</p>
                <p>Discord: roshan#6221</p>
        </div>
        </div>
        </div>
        </div>
        </main>
        <footer>Roshan Taneja &copy; all rights reserved.</footer>
    </>
    )
}