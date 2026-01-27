import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { colors } from '@/theme/tokens';
import QuizIllustration from '@/assets/quiz.svg?react';
const quotes = [
    {
        text: 'Test your knowledge, track your progress, achieve excellence.',
        author: 'Quiz Master',
    },
    {
        text: 'Learning made engaging through interactive assessments.',
        author: 'Education Platform',
    },
    {
        text: 'Challenge yourself, compete with others, grow together.',
        author: 'Learning Community',
    },
];

export default function AuthBrandPanel() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[800]} 100%)`,
                color: 'white',
                p: 6,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Floating background shapes */}
            <Box
                component={motion.div}
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    filter: 'blur(60px)',
                }}
            />
            <Box
                component={motion.div}
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                sx={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '15%',
                    width: 250,
                    height: 250,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    filter: 'blur(70px)',
                }}
            />

            {/* Logo/Brand */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                    Quiz System
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Professional Assessment Platform
                </Typography>
            </Box>

            {/* Center illustration */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    my: 4,
                }}
            >
                <QuizIllustration />
            </Box>

            {/* Quote/Testimonial */}
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    p: 3,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontStyle: 'italic',
                        mb: 1,
                        lineHeight: 1.6,
                    }}
                >
                    "{randomQuote.text}"
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    — {randomQuote.author}
                </Typography>
            </Box>
        </Box>
    );
}
