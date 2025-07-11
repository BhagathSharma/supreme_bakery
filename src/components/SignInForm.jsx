import { signIn } from "../auth";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

export function SignInForm() {
  const handleFormAction = async (formData) => {
    "use server";
    await signIn("mailgun", formData);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
        mt={6}
      >
        <Typography variant="h5" fontWeight={600}>
          Sign In
        </Typography>

        <Paper
          elevation={3}
          component="form"
          action={handleFormAction}
          sx={{
            p: 4,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            type="email"
            name="email"
            label="Email"
            placeholder="you@example.com"
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            size="large"
          >
            Sign in with Mailgun
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
