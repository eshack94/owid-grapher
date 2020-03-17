import { ClientSettings } from "clientSettings"
import * as React from "react"
import { Head } from "./Head"
import { SiteHeader } from "./SiteHeader"
import { SiteFooter } from "./SiteFooter"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch"

export const SearchPage = (props: { clientSettings: ClientSettings }) => {
    return (
        <html>
            <Head
                clientSettings={props.clientSettings}
                canonicalUrl={`${props.clientSettings.BAKED_BASE_URL}/search`}
                pageTitle="Search"
                pageDesc="Search articles and charts on Our World in Data."
            />
            <body className="SearchPage">
                <SiteHeader />
                <main>
                    <form action="/search" method="GET">
                        <div className="inputWrapper">
                            <input
                                type="search"
                                name="q"
                                placeholder={`Try "Poverty", "Population growth" or "Plastic pollution"`}
                                autoFocus
                            />
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <button type="submit">Search</button>
                    </form>
                    <div className="searchResults"></div>
                </main>
                <SiteFooter
                    hideDonate={true}
                    clientSettings={props.clientSettings}
                />
                <script>{`window.runSearchPage()`}</script>
            </body>
        </html>
    )
}
