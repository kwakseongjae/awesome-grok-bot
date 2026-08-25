type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

type Props = {
  data: JsonLdValue;
};

export const JsonLd = ({ data }: Props) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
