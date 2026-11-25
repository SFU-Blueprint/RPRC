import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { ReactNode } from 'react';
import {
  BRAND_COLORS,
  EMAIL_ASSET_PATHS,
  EMAIL_FONTS,
} from '@/lib/constants/brand';
import { EMAIL_COPY } from '@/lib/constants/email';

type EmailLayoutProps = {
  /** Inbox preview text. */
  preview: string;
  siteUrl: string;
  children: ReactNode;
};

/** Header bar with logo, title and green stripe; white body; no footer. */
export function EmailLayout({ preview, siteUrl, children }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: BRAND_COLORS.CARD_BACKGROUND,
          margin: 0,
          padding: '24px 0',
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: BRAND_COLORS.WHITE,
          }}
        >
          <Section
            style={{
              backgroundColor: BRAND_COLORS.HEADER,
              padding: '16px 24px',
            }}
          >
            <table role="presentation" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td style={{ paddingRight: '12px', verticalAlign: 'middle' }}>
                    <Img
                      src={`${siteUrl}${encodeURI(EMAIL_ASSET_PATHS.LOGO)}`}
                      width="49"
                      height="36"
                      alt="RPRC"
                    />
                  </td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <Text
                      style={{
                        fontFamily: EMAIL_FONTS.HEADING,
                        fontSize: '20px',
                        fontWeight: 700,
                        color: BRAND_COLORS.WHITE,
                        margin: 0,
                      }}
                    >
                      {EMAIL_COPY.HEADER_TITLE}
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>
          <Section
            style={{
              backgroundColor: BRAND_COLORS.PRIMARY,
              height: '6px',
              lineHeight: '6px',
              fontSize: '1px',
            }}
          >
            &nbsp;
          </Section>
          <Section style={{ padding: '32px 24px' }}>{children}</Section>
        </Container>
      </Body>
    </Html>
  );
}
