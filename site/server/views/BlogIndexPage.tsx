import * as React from "react"
import * as lodash from "lodash"

import { ClientSettings } from "clientSettings"
import { Head } from "./Head"
import { SiteHeader } from "./SiteHeader"
import { SiteFooter } from "./SiteFooter"
import { formatAuthors, formatDate } from "../formatting"
import { FullPost } from "../../../db/wpdb"
import { CovidBanner } from "./CovidBanner"

export const BlogIndexPage = (props: {
    posts: FullPost[]
    pageNum: number
    numPages: number
    clientSettings: ClientSettings
}) => {
    const { posts, pageNum, numPages, clientSettings } = props
    const pageNums = lodash.range(1, numPages + 1)
    const pageTitle = "Latest publications"

    return (
        <html>
            <Head
                clientSettings={clientSettings}
                canonicalUrl={
                    `${clientSettings.BAKED_BASE_URL}/blog` +
                    (pageNum > 1 ? `/page/${pageNum}` : "")
                }
                pageTitle={pageTitle}
            />
            <body className="blog">
                <SiteHeader />

                <main className="wrapper">
                    <div className="site-content">
                        <h2>{pageTitle}</h2>
                        <CovidBanner />
                        <ul className="posts">
                            {posts.map(post => (
                                <li key={post.slug} className="post">
                                    <a href={`/${post.path}`}>
                                        {post.imageUrl && (
                                            <img src={post.imageUrl} />
                                        )}
                                        <h3>{post.title}</h3>
                                        <div className="entry-meta">
                                            <time>{formatDate(post.date)}</time>{" "}
                                            by {formatAuthors(post.authors)}
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <nav
                            className="navigation pagination"
                            role="navigation"
                        >
                            <h2 className="screen-reader-text">
                                Posts navigation
                            </h2>
                            <div className="nav-link">
                                {pageNums.map(num => (
                                    <a
                                        key={num}
                                        className={
                                            "page-numbers" +
                                            (num === pageNum ? " current" : "")
                                        }
                                        href={
                                            num === 1
                                                ? "/blog/"
                                                : `/blog/page/${num}`
                                        }
                                    >
                                        {num}
                                    </a>
                                ))}
                            </div>
                        </nav>
                    </div>
                </main>
                <SiteFooter clientSettings={clientSettings} />
            </body>
        </html>
    )
}
