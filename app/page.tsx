import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fraunces } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";
import { FaStar } from "react-icons/fa";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <main className="bg-c-bg">
      <Navbar />
      {/* HERO */}
      <section className="min-h-[70dvh] px-4 py-10 flex flex-col items-center gap-7">
        <Badge>
          <div className="bg-green w-5 h-5 flex items-center justify-center rounded-full p-0.5">
            <FaStar className="text-white" size={12} />
          </div>
          No awkward &apos;&apos;can I be added?&apos;&apos; messages
        </Badge>
        <div className="flex flex-col items-center gap-7">
          <h1
            className={cn(
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-center",
              fraunces.className,
            )}
          >
            Your neighbourhood,
            <br /> <em className="italic text-green">open to everyone.</em>
          </h1>
          <p className="max-w-150 w-full text-center">
            Community replaces chaotic WhatsApp groups with a public structured
            space where residents join freely, stay informed and report issues
            &mdash; no middleman required.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button size={"lg"}>Find my community</Button>
            <Button
              size={"lg"}
              className="bg-inherit border border-line text-ink hover:bg-inherit hover:border-black"
            >
              Create a community group
            </Button>
          </div>
          <div className="flex items-center text-sm text-muted-foreground font-light tracking-tight gap-0.5 text-center">
            <span>Free to join</span>
            <Dot />
            <span>No admin approval needed</span>
            <Dot />
            <span>Open by default</span>
          </div>
        </div>
      </section>

      {/* APP MOCKUP */}
      <div className="mockup-wrap ">
        <div className="mockup-shell">
          <div className="shell-bar">
            <div className="dot" style={{ background: "#ff5f57" }}></div>
            <div className="dot" style={{ background: "#febc2e" }}></div>
            <div className="dot" style={{ background: "#28c840" }}></div>
            <div className="shell-title">
              Community &mdash; Soweto West · Ward 44
            </div>
          </div>
          <div className="app-layout">
            <div className="sidebar">
              <div className="sb-section">
                <div className="sb-label">My communities</div>
                <div className="sb-item active">
                  <div
                    className="sb-dot"
                    style={{ background: "#1a6b3c" }}
                  ></div>
                  Soweto West
                  <span className="sb-badge">3</span>
                </div>
                <div className="sb-item">
                  <div
                    className="sb-dot"
                    style={{ background: "#1a3a6b" }}
                  ></div>
                  Pimville Ward 45
                </div>
                <div className="sb-item">
                  <div
                    className="sb-dot"
                    style={{ background: "#b85c00" }}
                  ></div>
                  Orlando East
                </div>
              </div>
              <div className="sb-new">+ Join a community</div>
              <div className="sb-section" style={{ marginTop: "1.2rem" }}>
                <div className="sb-label">Filter</div>
                <div className="sb-item">📢 Announcements</div>
                <div className="sb-item">🚨 Reports</div>
                <div className="sb-item">📋 Notices</div>
                <div className="sb-item">✅ Resolved</div>
              </div>
            </div>
            <div className="main-feed">
              <div className="feed-top">
                <div className="feed-heading">Soweto West</div>
                <div className="feed-tabs">
                  <button className="tab on">All</button>
                  <button className="tab">Reports</button>
                  <button className="tab">Notices</button>
                </div>
              </div>

              <div className="post-card">
                <div className="post-head">
                  <div
                    className="avatar"
                    style={{
                      background: "#fde8e8",
                      color: "#c0392b",
                    }}
                  >
                    TM
                  </div>
                  <div className="post-meta">
                    <div className="post-author">Thandi Mokoena</div>
                    <div className="post-time">Today at 09:14</div>
                  </div>
                  <div className="post-type type-report">🚨 Report</div>
                </div>
                <div className="post-body">
                  There&apos;s been no water in Khumalo Street since yesterday
                  evening. Taps are completely dry. Anyone else affected?
                  I&apos;ve logged it with Joburg Water but no response yet.
                </div>
                <div className="post-footer">
                  <button className="pf-action">👍 Support · 24</button>
                  <button className="pf-action">💬 12 comments</button>
                  <button className="pf-action">🔗 Share</button>
                  <div className="vote-count">Marked urgent by moderator</div>
                </div>
              </div>

              <div className="post-card">
                <div className="post-head">
                  <div
                    className="avatar"
                    style={{
                      background: "#e8f4ed",
                      color: "#1a6b3c",
                      fontSize: "0.6rem",
                    }}
                  >
                    MOD
                  </div>
                  <div className="post-meta">
                    <div className="post-author">
                      Sipho Dlamini{" "}
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "#1a6b3c",
                          fontWeight: 600,
                        }}
                      >
                        {" "}
                        · Moderator
                      </span>
                    </div>
                    <div className="post-time">Yesterday at 16:30</div>
                  </div>
                  <div className="post-type type-notice">📋 Notice</div>
                </div>
                <div className="post-body">
                  Community meeting this Saturday 10am at the Soweto West
                  Community Hall. Agenda: illegal dumping near the school,
                  streetlight repairs update, and the new taxi route proposal.
                  All welcome.
                </div>
                <div className="post-footer">
                  <button className="pf-action">👍 42</button>
                  <button className="pf-action">💬 8 comments</button>
                  <button className="pf-action">📅 Add to calendar</button>
                </div>
              </div>

              <div className="post-card" style={{ opacity: 0.75 }}>
                <div className="post-head">
                  <div
                    className="avatar"
                    style={{
                      background: "#e8eef8",
                      color: "#1a3a6b",
                    }}
                  >
                    BN
                  </div>
                  <div className="post-meta">
                    <div className="post-author">Bongani Nkosi</div>
                    <div className="post-time">2 days ago</div>
                  </div>
                  <div className="post-type type-update">✅ Resolved</div>
                </div>
                <div className="post-body">
                  Update: The pothole on Motsepe Ave has been repaired by the
                  City. Took 11 days from first report. Thanks everyone who
                  supported the post — proof that this works.
                </div>
                <div className="post-footer">
                  <button className="pf-action">👍 67</button>
                  <button className="pf-action">💬 19 comments</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border w-full border-line"></div>

      {/*WHY sect */}
      <section
        id="whycommunity"
        className="p-10 mx-auto max-w-230 w-full space-y-9"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="uppercase text-muted-foreground font-medium">
            Why community
          </span>
          <h2
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-semibold",
              fraunces.className,
            )}
          >
            Everything wrong with <br /> WhatsApp groups,{" "}
            <em className="italic text-green">fixed.</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="max-w-sm w-full rounded-none">
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <span className="text-xl block">🔓</span>
                <p className="text-lg font-medium">
                  Open access, no gatekeeping
                </p>
              </div>
              <p className="text-muted-foreground">
                Anyone can find and join their community group instantly. No
                waiting, no awkward DMs asking to be added, no admin deciding
                who belongs.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-muted-foreground line-through">
                  Beg admin to add you
                </span>
                →
                <span className="text-green font-medium">
                  Join yourself, instantly
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="max-w-sm w-full rounded-none">
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <span className="text-xl block">📌</span>
                <p className="text-lg font-medium">
                  Posts don&apos;t disappear
                </p>
              </div>
              <p className="text-muted-foreground">
                Issues, notices, and updates are permanently searchable. No more
                scrolling through 500 messages to find what was said about the
                water outage last week.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-muted-foreground line-through">
                  Scroll through 500 messages
                </span>
                →
                <span className="text-green font-medium">
                  Search &amp; filter
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="max-w-sm w-full rounded-none">
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <span className="text-xl block">🗂️</span>
                <p className="text-lg font-medium">
                  Structured &amp; organised
                </p>
              </div>
              <p className="text-muted-foreground">
                Reports are categorised, tracked, and marked resolved. Community
                notices are pinned. It&apos;s not a chat &mdash; it&apos;s a
                community record.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-muted-foreground line-through">
                  Chaos in a chat
                </span>
                →
                <span className="text-green font-medium">
                  Organised by type
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="max-w-sm w-full rounded-none">
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <span className="text-xl block">📣</span>
                <p className="text-lg font-medium">Transparent moderation</p>
              </div>
              <p className="text-muted-foreground">
                Moderators are visible and accountable. Anyone can see
                who&apos;s running the group, what&apos;s been pinned, and why
                something was removed.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-muted-foreground line-through">
                  Mystery admin, hidden rules
                </span>
                →
                <span className="text-green font-medium">
                  Clear, open governance
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="max-w-sm w-full rounded-none">
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <span className="text-xl block">📊</span>
                <p className="text-lg font-medium">Real accountability</p>
              </div>
              <p className="text-muted-foreground">
                Reports get upvoted by neighbours, creating community-backed
                proof that issues need urgent attention — harder for authorities
                to ignore.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-muted-foreground line-through">
                  One voice, easy to dismiss
                </span>
                →
                <span className="text-green font-medium">
                  Community-backed reports
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="max-w-sm w-full rounded-none">
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <span className="text-xl block">🌍</span>
                <p className="text-lg font-medium">No phone number needed</p>
              </div>
              <p className="text-muted-foreground">
                Your number stays private. Participate in your community without
                sharing personal contact details with hundreds of strangers.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="text-muted-foreground line-through">
                  Phone number exposed
                </span>
                →
                <span className="text-green font-medium">
                  Private by default
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="howitworks" className="p-10  bg-black text-white">
        <div className="mx-auto max-w-230 space-y-9">
          <div className="flex flex-col items-start gap-1">
            <span className="uppercase text-muted-foreground font-medium">
              how it works
            </span>
            <h2
              className={cn(
                "text-3xl sm:text-4xl font-semibold",
                fraunces.className,
              )}
            >
              Up and running in minutes.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-[#202020] gap-5">
            <div className="flex flex-col items-start gap-3">
              <span
                className={cn(fraunces.className, "text-4xl text-[#202020]")}
              >
                01
              </span>
              <h4 className="font-semibold">Find your community</h4>
              <p className="text-muted-foreground text-sm">
                Search by surburb, ward, or area name. Your neighbourhood group
                is already there &mdash; or you can create one.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <span
                className={cn(fraunces.className, "text-4xl text-[#202020]")}
              >
                02
              </span>
              <h4 className="font-semibold">Join with one click</h4>
              <p className="text-muted-foreground text-sm">
                No waiting for approval. Sign up and you&apos;re in &mdash; see
                everything happening in your aread immediately.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <span
                className={cn(fraunces.className, "text-4xl text-[#202020]")}
              >
                03
              </span>
              <h4 className="font-semibold">Stay informed</h4>
              <p className="text-muted-foreground text-sm">
                Get notified about reports, notices and updates relevant to
                where you live. Read, comment and upvote.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <span
                className={cn(fraunces.className, "text-4xl text-[#202020]")}
              >
                04
              </span>
              <h4 className="font-semibold">Report issues</h4>
              <p className="text-muted-foreground text-sm">
                Spot a problem? Post it. Your neighbours can support it and
                moderators can escalate to local authorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="foradmins"
        className="p-10 mx-auto max-w-230 w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-start"
      >
        <div className="flex flex-col items-start gap-3">
          <span className="uppercase text-muted-foreground font-medium">
            roles &amp; structure
          </span>
          <h2
            className={cn(
              "text-3xl sm:text-4xl font-medium",
              fraunces.className,
            )}
          >
            Everyone has a place. Not everyone has the same power.
          </h2>
          <p className="text-muted-foreground">
            Community is built on clear, transparent roles. Residents
            participate freely. Moderators keep things civil. Admins set the
            rules. Everyone can see who &apos;s who.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4">
          <Card>
            <CardContent className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <Button size={"sm"} className="bg-primary hover:bg-primary/80">
                  Admin
                </Button>
                <h4 className="font-semibold">Community admin</h4>
              </div>
              <p className="text-muted-foreground">
                Creates and owns the community group. Sets posting rules
                appoints moderators and managers the community&apos;s identity.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Create group
                </Badge>
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Appoint mods
                </Badge>
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Set rules
                </Badge>
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Remove members
                </Badge>
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Pin posts
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#b8dfc8] bg-green-light">
            <CardContent className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  className="text-blue hover:bg-blue-light"
                >
                  Moderator
                </Button>
                <h4 className="font-semibold">Community moderator</h4>
              </div>
              <p className="text-muted-foreground">
                Trusted community members who help manage posts, escalate urgent
                reports and keep discussions constructive.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Pin posts
                </Badge>
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Mark resolved
                </Badge>
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Escalate reports
                </Badge>
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Remove content
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <Button
                  size={"sm"}
                  className="bg-green-light text-green border-[#b8dfc8] hover:bg-green-light/80"
                >
                  Member
                </Button>
                <h4 className="font-semibold">Community member</h4>
              </div>
              <p className="text-muted-foreground">
                Any resident who joins freely. Can post updates, file reports,
                comment and upvote issues that matter to them.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Join freely
                </Badge>
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Post reports
                </Badge>
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Comment
                </Badge>
                <Badge variant={"outline"} className="bg-c-bg h-6">
                  Upvote
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="p-10 bg-green-light min-h-[50dvh] flex items-center justify-center">
        <div className="mx-auto w-full max-w-230 flex flex-col items-center gap-5 justify-center">
          <h2
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl font-semibold text-center",
              fraunces.className,
            )}
          >
            Your street deserves <br /> a{" "}
            <em className="italic text-green">voice.</em>
          </h2>
          <p className="text-muted-foreground max-w-120 w-full text-center">
            Find your community, join for free and start making your
            neighbourhood a place that works for everyone who lives there.
          </p>
          <div className="flex items-center gap-3">
            <Button>Find my community</Button>
            <Button variant="outline">Create a group</Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
