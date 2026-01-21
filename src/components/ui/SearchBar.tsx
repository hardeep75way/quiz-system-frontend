import { TextField, InputAdornment, IconButton, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useEffect } from 'react';

interface Filter {
    label: string;
    value: string;
}

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    filters?: Filter[];
    onFilterChange?: (filter: string) => void;
    defaultFilter?: string;
}

export default function SearchBar({
    placeholder = 'Search...',
    onSearch,
    filters,
    onFilterChange,
    defaultFilter = 'all',
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Call onSearch when debounced query changes
    useEffect(() => {
        onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    const handleFilterChange = (value: string) => {
        setSelectedFilter(value);
        if (onFilterChange) {
            onFilterChange(value);
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                size="small"
                sx={{
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: 300 },
                    maxWidth: { md: 400 },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: query && (
                        <InputAdornment position="end">
                            <IconButton size="small" onClick={handleClear} edge="end">
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            {filters && filters.length > 0 && (
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select
                        value={selectedFilter}
                        label="Filter"
                        onChange={(e) => handleFilterChange(e.target.value)}
                    >
                        {filters.map((filter) => (
                            <MenuItem key={filter.value} value={filter.value}>
                                {filter.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Box>
    );
}
