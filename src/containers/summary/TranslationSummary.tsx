import { Language } from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import useTranslation from "../../hooks/useTranslation";

interface TranslationSummaryProps {
  handleEdit: () => void;
  language: string;
  languageConfig: any;
  keys: Array<any>;
  isEditBtn?: boolean;
}

function TranslationSummary({
  handleEdit,
  language,
  languageConfig,
  keys,
  isEditBtn = true,
}: TranslationSummaryProps) {
  const { translate } = useTranslation();
  return (
    <Box
      border={"1px solid #e0e0e0"}
      dir={language === "ar" ? "rtl" : "ltr"}
      borderRadius={1.3}
    >
      <Stack direction="row" justifyContent="space-between" padding={2}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Language />
          <Typography variant="h5">{language}</Typography>
        </Stack>
        {isEditBtn && (
          <Button size="small" sx={{ height: 20 }} onClick={handleEdit}>
            Edit
          </Button>
        )}
      </Stack>
      <Divider />

      <Stack direction="row" flexWrap="wrap" gap={1.5} padding={2}>
        {keys.map(({ label, value }: { label: string; value: string }) => (
          <>
            <FormFields
              title={translate(label)}
              text={languageConfig?.[value]}
            />
          </>
        ))}
      </Stack>
    </Box>
  );
}

export default TranslationSummary;

function FormFields({ title, text }: { title: any; text: any }) {
  return (
    <Stack minWidth={100} maxWidth={250}>
      <Typography variant="caption" fontWeight="600" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6" fontWeight={600}>
        {text}
      </Typography>
    </Stack>
  );
}
