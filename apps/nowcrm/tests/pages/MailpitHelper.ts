import { APIRequestContext, expect } from '@playwright/test';

export class MailpitHelper {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    /**
     * Waits for a specific number of emails to be received by a recipient with a given subject.
     * @param recipient The recipient email address.
     * @param subject The expected email subject.
     * @param expectedCount The number of emails expected.
     * @param timeoutMs How long to wait (default 90000ms).
     * @returns Array of email objects.
     */
    async waitForEmails(recipient: string, subject: string, expectedCount = 2, timeoutMs = 90000) {
        let foundEmails: any[] = [];
        const pollInterval = 2000;
        const maxAttempts = Math.ceil(timeoutMs / pollInterval);

        for (let i = 0; i < maxAttempts; i++) {
            try {
                const resp = await this.request.get('http://localhost:8025/api/v1/messages');
                expect(resp.ok()).toBeTruthy();
                const emails = (await resp.json()).messages;
                foundEmails = emails.filter((email: any) =>
                    email.To.some((to: any) => to.Address === recipient) &&
                    email.Subject === subject
                );
                console.log(`[MailpitHelper] Poll ${i + 1}/${maxAttempts}: found ${foundEmails.length}/${expectedCount} emails for ${recipient} with subject "${subject}"`);
                if (foundEmails.length >= expectedCount) break;
                await new Promise(res => setTimeout(res, pollInterval));
            } catch (err) {
                console.warn('[MailpitHelper] Polling stopped due to error or context closed:', err);
                break;
            }
        }
        expect(foundEmails.length, `Expected ${expectedCount} emails for ${recipient} with subject "${subject}"`).toBe(expectedCount);
        return foundEmails;
    }

    /**
     * Asserts that all emails in the array have the expected subject and body content.
     */
    async assertEmailsContent(emails: any[], expectedSubject: string, expectedBody: string) {
        for (const email of emails) {
            const messageId = email.ID;
            const fullResp = await this.request.get(`http://localhost:8025/api/v1/message/${messageId}`);
            expect(fullResp.ok()).toBeTruthy();
            const fullMessage = await fullResp.json();
            expect(fullMessage.Subject).toBe(expectedSubject);

            // Debug log
            console.log('Mailpit email subject:', fullMessage.Subject);
            console.log('Mailpit email text:', fullMessage.Text);
            console.log('Mailpit email html:', fullMessage.HTML);

            // If expectedBody is empty, skip body assert
            if (expectedBody) {
                expect(
                    (fullMessage.Text && fullMessage.Text.includes(expectedBody)) ||
                    (fullMessage.HTML && fullMessage.HTML.includes(expectedBody))
                ).toBeTruthy();
            }
        }
    }
}
