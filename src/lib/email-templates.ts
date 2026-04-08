interface EmailTemplate {
  subject: string;
  html: string;
}

const FOOTER = `
<p style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;color:#64748b;">
  This email was sent from <a href="https://mocopb.com" style="color:#0d7c5f;">MoCo PB</a> — your guide to pickleball in Montgomery County, MD.<br/>
  Questions? Reply to this email or text Sam at 301-325-4731.
</p>`;

function wrap(name: string, body: string): string {
  const firstName = name.split(" ")[0];
  return `
<div style="font-family:'Inter',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a2e1a;line-height:1.6;">
  <div style="text-align:center;padding:24px 0;border-bottom:2px solid #0d7c5f;">
    <span style="font-size:22px;font-weight:700;color:#0d7c5f;">MoCo PB</span>
  </div>
  <div style="padding:24px 16px;">
    <p style="font-size:16px;">Hi ${firstName},</p>
    ${body}
    <p>Welcome to the MoCo pickleball community!</p>
    <p style="margin-bottom:4px;">— Sam Morris</p>
    <p style="font-size:13px;color:#64748b;margin-top:0;">Director of Programming, Dill Dinkers<br/>Founder, Link &amp; Dink</p>
    ${FOOTER}
  </div>
</div>`;
}

function cta(text: string, href: string): string {
  return `<p style="text-align:center;margin:24px 0;">
    <a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:15px;">${text}</a>
  </p>`;
}

export function getWelcomeEmail(name: string, interest: string): EmailTemplate {
  switch (interest) {
    case "open-play":
      return {
        subject: "Welcome! Here's how to find open play in MoCo",
        html: wrap(name, `
          <p>Thanks for reaching out! You're looking for open play — great choice. It's the easiest way to get games and meet other players.</p>
          <p><strong>Here's how to get started:</strong></p>
          <ul>
            <li><strong>Indoor (year-round):</strong> <a href="https://dilldinkers.com?utm_source=mocopb&utm_medium=email&utm_campaign=welcome_open_play" style="color:#0d7c5f;">Dill Dinkers</a> in Rockville and North Bethesda run daily open play sessions. Reserve through CourtReserve.</li>
            <li><strong>Outdoor (free):</strong> Cabin John Regional Park, Bauer Drive, and Mattie Stepanek Park in Rockville have free courts. Morning and evening are the most active times.</li>
            <li><strong>Find regular partners:</strong> Join <a href="https://linkanddink.com?utm_source=mocopb&utm_medium=email&utm_campaign=welcome_open_play" style="color:#0d7c5f;">Link &amp; Dink</a> to connect with 2,000+ local players and find groups at your level.</li>
          </ul>
          ${cta("Find Open Play Near You", "https://mocopb.com/open-play?utm_source=email&utm_medium=welcome&utm_campaign=open_play")}
        `),
      };

    case "find-players":
      return {
        subject: "Welcome! Let's find you pickleball partners in MoCo",
        html: wrap(name, `
          <p>You're looking for playing partners — you've come to the right place. Montgomery County has one of the most active pickleball communities in the DMV.</p>
          <p><strong>Three ways to find players:</strong></p>
          <ol>
            <li><strong>Join Link &amp; Dink</strong> — Our community platform connects 2,000+ MoCo players. Get matched by skill level and find groups near you.</li>
            <li><strong>Show up to open play</strong> — Cabin John, Dill Dinkers, and Bauer Drive all have regular open play where you'll meet players and rotate partners.</li>
            <li><strong>Join a league</strong> — DUPR-rated leagues at Dill Dinkers run year-round. Great for finding consistent, competitive partners.</li>
          </ol>
          ${cta("Join the Community", "https://linkanddink.com?utm_source=mocopb&utm_medium=email&utm_campaign=welcome_find_players")}
        `),
      };

    case "lessons":
      return {
        subject: "Welcome! Let's level up your pickleball game",
        html: wrap(name, `
          <p>Great decision — private coaching is the fastest way to improve. I offer lessons at Dill Dinkers indoor facilities in Rockville and North Bethesda.</p>
          <p><strong>What to expect:</strong></p>
          <ul>
            <li><strong>Video analysis</strong> — I record key drills so you can see your technique from a coach's perspective.</li>
            <li><strong>Custom practice plan</strong> — You'll leave every session with specific drills to work on between lessons.</li>
            <li><strong>Flexible scheduling</strong> — Weekday and weekend availability.</li>
          </ul>
          <p>I'm PPR-certified with a Master's in Coaching and work with players from complete beginners to 5.0+ competitors.</p>

          <h3 style="margin-top:28px;font-size:16px;color:#0d7c5f;">Get Your DUPR Rating</h3>
          <p>Here's how to get your pickleball DUPR rating set up so you can get the right level of play at Dill Dinkers:</p>
          <ol>
            <li>Create a free DUPR account at <a href="https://www.dupr.com" style="color:#0d7c5f;">www.dupr.com</a></li>
            <li>Click my unique link to download My DUPR Coach app: <a href="https://link.myjourneypickleball.com/2wnGAldZBQb" style="color:#0d7c5f;">Download Here</a></li>
            <li>In the My DUPR Coach app, go to the "…" menu and scroll down to "Connect" to DUPR (it will prompt you to sign into your DUPR account)</li>
            <li><strong>Schedule your 30-minute evaluation</strong> — reach out to Coach Sam to get on court. I'll check out your skills and give you your initial rating.</li>
          </ol>
          <p><strong>Evaluation details:</strong></p>
          <ul>
            <li><strong>FREE</strong> for Dill Dinkers members (Rockville and/or North Bethesda). $15 for visitors.</li>
            <li>Generally available <strong>weekdays before 4pm</strong> — Tuesdays at Dill Dinkers North Bethesda (4942 Boiling Brook Pkwy) and Thursdays at Rockville (40C Southlawn Ct).</li>
            <li>Coach Danny is also DUPR certified and can be scheduled at <a href="mailto:Dan.grijalva@pm.me" style="color:#0d7c5f;">Dan.grijalva@pm.me</a></li>
          </ul>

          <p><strong>Want help finding people to play with locally?</strong> Join my <a href="https://linkanddink.com?utm_source=mocopb&utm_medium=email&utm_campaign=welcome_lessons" style="color:#0d7c5f;">Link &amp; Dink</a> community — I'll help connect you with other players when you need it.</p>

          ${cta("Book a Lesson", "https://www.sammorrispb.com/programs/coaching?utm_source=mocopb&utm_medium=email&utm_campaign=welcome_lessons")}
        `),
      };

    case "clinics":
      return {
        subject: "Welcome! Group clinics are a great way to improve",
        html: wrap(name, `
          <p>Clinics are perfect — you get professional instruction while meeting other players at your level. It's more affordable than private lessons and a lot of fun.</p>
          <p><strong>What we offer:</strong></p>
          <ul>
            <li><strong>Beginner clinics</strong> — Fundamentals for brand new players</li>
            <li><strong>Dinking &amp; kitchen play</strong> — Master the soft game</li>
            <li><strong>Serve &amp; return</strong> — Build a reliable serve</li>
            <li><strong>Strategy &amp; match play</strong> — For intermediate to advanced players</li>
          </ul>
          <p>Clinics run at Dill Dinkers facilities in Rockville and North Bethesda. Check the schedule for upcoming sessions.</p>
          ${cta("View Upcoming Clinics", "https://www.sammorrispb.com/programs?utm_source=mocopb&utm_medium=email&utm_campaign=welcome_clinics")}
        `),
      };

    case "youth":
      return {
        subject: "Welcome! Youth pickleball programs for your child",
        html: wrap(name, `
          <p>Thanks for your interest in youth pickleball! Next Gen Pickleball Academy is the only dedicated youth program in Montgomery County, and we'd love to have your child join us.</p>
          <p><strong>How it works:</strong></p>
          <ul>
            <li><strong>Ages 5-16</strong> — Four skill levels (Red, Orange, Green, Yellow) ensure your child progresses at the right pace.</li>
            <li><strong>Indoor facilities</strong> — Climate-controlled courts at Dill Dinkers. No weather cancellations.</li>
            <li><strong>Certified coaches</strong> — Led by Coach Sam Morris (PPR certified, M.S. in Coaching).</li>
            <li><strong>Clear progression</strong> — Kids advance through levels as their skills develop.</li>
          </ul>
          <p>We'd love to set up a free evaluation so we can place your child in the right group.</p>
          ${cta("Explore Youth Programs", "https://www.nextgenacademypb.com?utm_source=mocopb&utm_medium=email&utm_campaign=welcome_youth")}
        `),
      };

    case "leagues":
      return {
        subject: "Welcome! Pickleball leagues in Montgomery County",
        html: wrap(name, `
          <p>Leagues are the best way to play competitive, organized pickleball. We run DUPR-rated leagues at Dill Dinkers year-round.</p>
          <p><strong>What you need to know:</strong></p>
          <ul>
            <li><strong>Seasons</strong> — Spring, Summer, Fall, and Winter leagues (6-8 weeks each).</li>
            <li><strong>Skill-based divisions</strong> — You'll play against players at your level.</li>
            <li><strong>DUPR-rated</strong> — Every match counts toward your official rating.</li>
            <li><strong>No rating?</strong> No problem — beginners start in the introductory division. I can also do a skill evaluation to help place you.</li>
          </ul>
          <p>Join the community to get notified when the next season opens for registration.</p>
          ${cta("Join the Community", "https://linkanddink.com?utm_source=mocopb&utm_medium=email&utm_campaign=welcome_leagues")}
        `),
      };

    case "facility":
      return {
        subject: "Welcome! Indoor pickleball at Dill Dinkers",
        html: wrap(name, `
          <p>Thanks for your interest in Dill Dinkers! We have two premier indoor pickleball facilities in Montgomery County.</p>
          <p><strong>Our locations:</strong></p>
          <ul>
            <li><strong>Dill Dinkers Rockville</strong> — 8 courts, 40C Southlawn Court, Rockville MD 20850</li>
            <li><strong>Dill Dinkers North Bethesda</strong> — 9 courts, 4942 Boiling Brook Pkwy, North Bethesda MD 20852</li>
          </ul>
          <p><strong>What we offer:</strong></p>
          <ul>
            <li>Daily open play sessions (morning, afternoon, evening)</li>
            <li>Private lessons and group clinics</li>
            <li>DUPR-rated leagues</li>
            <li>Tournaments and social events</li>
            <li>Pro shop with equipment and accessories</li>
          </ul>
          ${cta("Visit Dill Dinkers", "https://dilldinkers.com?utm_source=mocopb&utm_medium=email&utm_campaign=welcome_facility")}
        `),
      };

    default:
      return {
        subject: "Welcome to the MoCo pickleball community!",
        html: wrap(name, `
          <p>Thanks for reaching out! Montgomery County has an amazing pickleball community and I'm happy to help you find what you're looking for.</p>
          <p><strong>Here are some ways to get started:</strong></p>
          <ul>
            <li><a href="https://mocopb.com/courts?utm_source=email&utm_medium=welcome&utm_campaign=other" style="color:#0d7c5f;"><strong>Find courts</strong></a> — 9 facilities across MoCo (indoor and outdoor)</li>
            <li><a href="https://mocopb.com/open-play?utm_source=email&utm_medium=welcome&utm_campaign=other" style="color:#0d7c5f;"><strong>Open play</strong></a> — Drop in and play at Dill Dinkers or free outdoor courts</li>
            <li><a href="https://mocopb.com/lessons?utm_source=email&utm_medium=welcome&utm_campaign=other" style="color:#0d7c5f;"><strong>Lessons</strong></a> — Private coaching for all skill levels</li>
            <li><a href="https://mocopb.com/youth?utm_source=email&utm_medium=welcome&utm_campaign=other" style="color:#0d7c5f;"><strong>Youth programs</strong></a> — Academy for kids ages 5-16</li>
            <li><a href="https://linkanddink.com?utm_source=mocopb&utm_medium=email&utm_campaign=welcome_other" style="color:#0d7c5f;"><strong>Find players</strong></a> — Connect with 2,000+ local players</li>
          </ul>
          ${cta("Explore MoCo PB", "https://mocopb.com?utm_source=email&utm_medium=welcome&utm_campaign=other")}
        `),
      };
  }
}
