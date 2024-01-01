function waitFor(selector: string, callback: (element: HTMLElement) => void, callbackOnMutation: boolean = true): void {
    const element = document.querySelector(selector) as HTMLElement;

    if (element && !callbackOnMutation) {
        callback(element);
    } else if (!callbackOnMutation) {
        new MutationObserver((mutations, observer) => {
            const element = document.querySelector(selector) as HTMLElement;

            if (element) {
                observer.disconnect();
                callback(element);
            }
        }).observe(document, { childList: true, subtree: true });

        return;
    }

    new MutationObserver(() => {
        const element = document.querySelector(selector) as HTMLElement;

        if (element) {
            callback(element);
        }
    }).observe(document, { childList: true, subtree: true });
}

function waitForAll(selector: string, callback: (element: HTMLElement) => void, callbackOnMutation: boolean = true): void {
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

    if (elements && !callbackOnMutation) {
        elements.forEach(element => {
            callback(element);
        });
    } else if (!callbackOnMutation) {
        new MutationObserver((mutations, observer) => {
            const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

            if (elements) {
                observer.disconnect();
                elements.forEach(element => {
                    callback(element);
                });
            }
        }).observe(document, { childList: true, subtree: true });

        return;
    }

    new MutationObserver(() => {
        const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

        if (elements) {
            elements.forEach(element => {
                callback(element);
            });
        }
    }).observe(document, { childList: true, subtree: true });
}

function getColor() {
    return (document.querySelector('[data-testid="SideNav_NewTweet_Button"]') as HTMLElement)?.style.backgroundColor || '#1d9bf0';
}

const twitterIcon = '<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15"></path>';



window.onload = () => {
    // title
    waitFor('title', element => {
        const title = element as HTMLTitleElement;
        const values = {
            'on X': ' on Twitter',
            ' / X': ' / Twitter',
            'repost': 'Retweet',
            'Quotes': 'Quote Tweets',
            'Post': 'Tweet',
            'post': 'Tweet'
        };

        if (Object.keys(values).some(item => title.text.includes(item))) {
            Object.entries(values).forEach(([findValue, replaceValue]) => {
                title.text = title.text.replaceAll(findValue, replaceValue);
            });
        }
    });

    // favicon
    waitFor('[rel~="icon"]', element => {
        (element as HTMLAnchorElement).href = chrome.runtime.getURL('../images/twitter-32.png');
    }, false);

    // loading icon
    waitFor('#placeholder > svg', element => {
        if (element.innerHTML != twitterIcon) {
            element.innerHTML = twitterIcon;
            element.setAttribute('viewBox', '0 0 16 16');
            element.style.fill = getColor();
        }
    }, false);

    // sidebar twitter icon
    waitFor('[aria-label="X"] svg', element => {
        if (element.innerHTML != twitterIcon) {
            element.innerHTML = twitterIcon;
            element.setAttribute('viewBox', '0 0 16 16');
            element.style.fill = getColor();
            element.style.width = '32px';
            element.style.height = '32px';
        }
    });

    // sidebar tweet button text
    waitFor('[data-testid="SideNav_NewTweet_Button"] span span span', element => {
        if (element.textContent === 'Post') {
            element.textContent = 'Tweet';
        }
    });

    // timeline tweet button text
    waitFor('[data-testid="toolBar"] > div span span', element => {
        if (element.textContent == 'Post') {
            element.textContent = 'Tweet';
        }
    });

    // show new tweets button text
    waitFor('[data-testid="cellInnerDiv"] span', element => {
        if (element.textContent?.endsWith('posts')) {
            element.textContent = element.textContent.replace('posts', 'Tweets');
        }
    });

    // "show new tweets" notification text
    waitFor('[data-testid="pillLabel"] span span span', element => {
        if (element.textContent?.includes('post')) {
            element.textContent = element.textContent.replace('post', 'Tweet');
        }
    });

    // retweets text
    waitForAll('[data-testid="socialContext"]', elements => {
        if (elements.textContent?.endsWith('reposted')) {
            elements.innerHTML = elements.innerHTML.replace('reposted', 'Retweeted');
        }
    });

    // notifications text
    waitForAll('[data-testid="notification"] span span', element => {
        if (element.textContent?.includes('post')) {
            element.textContent = element.textContent.replace('post', 'Tweet');
        }
    });
    
    // trending tweets amount text
    waitForAll('[data-testid="trend"] > div > div:nth-child(3) > span', element => {
        if (element.textContent?.endsWith('posts')) {
            element.textContent = element.textContent.replace('posts', 'Tweets');
        }
    });
    
    // search bar placeholder text
    waitFor('[aria-label="Search query"]', element => {
        if ((element as HTMLInputElement).placeholder === 'Search') {
            (element as HTMLInputElement).placeholder = 'Search Twitter';
        }
    });

    // page title text
    waitForAll('h2 span', element => {
        if (element.textContent?.includes('Post')) {
            element.textContent = element.textContent.replace('Post', 'Tweet');
        } else if (element.textContent?.includes('X')) {
            element.textContent = element.textContent.replace('X', 'Twitter');
        }
    });

    // tweet counter text
    waitFor('[aria-label="Home timeline"] > div > div > div > div > div > div > div > div:nth-child(2) > div > div', element => {
        const userContent = document.querySelector('[data-testid="UserProfileSchema-test"]') as HTMLScriptElement | null;

        if (!userContent || !userContent.textContent || element.classList.contains('r-6koalj')) {
            return;
        }

        const tweetsCount: number = parseInt(userContent.textContent.split('"name":"Tweets","userInteractionCount":')[1].split('}]')[0]) || 1;

        let result: string = '1 Tweet';
        if (tweetsCount !== 1 && tweetsCount < 1000) {
            result = `${tweetsCount.toString()} Tweets`;
        } else if (tweetsCount < 1_000_000) {
            result = `${(tweetsCount / 1000).toFixed(1)}K Tweets`;
        } else {
            result = `${(tweetsCount / 1_000_000).toFixed(1)}M Tweets`;
        }

        if (element.textContent !== result) {
            element.textContent = result;
        }
    });

    // tweet engagement menu options
    waitForAll('[data-testid="ScrollSnap-List"] > [role="presentation"] span', element => {
        if (element.textContent === 'Quotes') {
            element.textContent = 'Quote Tweets';
        } else if (element.textContent === 'Reposts') {
            element.textContent = 'Retweets';
        }
    });

    // tweet engagements "no retweets/quote tweets" text (title)
    waitFor('[data-testid="empty_state_header_text"] span', element => {
        if (element.textContent === 'No Reposts yet') {
            element.textContent = 'No Retweets yet';
        } else if (element.textContent === 'No Quotes yet') {
            element.textContent = 'No Quote Tweets yet';
        }
    });

    // tweet engagements "no retweets/quote tweets" text (description)
    waitFor('[data-testid="empty_state_body_text"] span', element => {
        if (element.textContent?.includes('quoted')) {
            element.textContent = element.textContent.replaceAll('quoted', 'Quote Tweeted');
        } else if (element.textContent?.includes('repost')) {
            element.textContent = element.textContent.replaceAll('repost', 'Retweet');
        }

        if (element.textContent?.includes('post')) {
            element.textContent = element.textContent.replaceAll('post', 'Tweet');
        }
    });

    // tweet dropdown options
    waitForAll('[data-testid="Dropdown"] > [role="menuitem"] span', element => {
        if (element.textContent === 'Repost') {
            element.textContent = element.textContent.replace('Repost', 'Retweet');
        } else if (element.textContent === 'Quote' || element.textContent === 'View Quotes') {
            element.textContent = element.textContent.replace('Quote', 'Quote Tweet');
        }

        if (element.textContent?.includes('repost')) {
            element.textContent = element.textContent.replace('repost', 'Retweet');
        }

        if (element.textContent?.includes('post')) {
            element.textContent = element.textContent.replace('post', 'Tweet');
        }
    });

    // footer text
    waitFor(`[aria-label="Footer"] > div:nth-last-child(1) > span`, element => {
        if (element.textContent === `© ${new Date().getFullYear()} X Corp.`) {
            element.textContent = `© ${new Date().getFullYear()} Twitter, Inc.`;
        }
    });
};
