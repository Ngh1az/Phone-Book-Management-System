import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import AppLayout from '@/layouts/app-layout';
import { Contact, Group, PaginatedResponse, Tag } from '@/types/contact';
import { Head, Link, router } from '@inertiajs/react';
import {
    Edit,
    Heart,
    Mail,
    MoreVertical,
    Phone,
    Plus,
    Search,
    Trash2,
    User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ContactsIndexProps {
    contacts?: PaginatedResponse<Contact>;
    groups?: Group[];
    tags?: Tag[];
    filters?: {
        search?: string;
        group_id?: number;
        tag_id?: number;
        is_favorite?: boolean | string;
    };
}

export default function ContactsIndex({
    contacts,
    groups = [],
    tags = [],
    filters = {},
}: ContactsIndexProps) {
    // Debug: log props to see what we receive
    console.log('ContactsIndex props:', { contacts, groups, tags, filters });

    const [search, setSearch] = useState(filters?.search || '');
    const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
    const debouncedSearch = useDebounce(search, 500);

    // Update URL when search changes
    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            const newFilters: any = {
                search: debouncedSearch || undefined,
                group_id: filters.group_id,
                tag_id: filters.tag_id,
                is_favorite: filters.is_favorite,
            };

            // Remove undefined values to clean up query string
            Object.keys(newFilters).forEach((k) => {
                if (newFilters[k] === undefined) {
                    delete newFilters[k];
                }
            });

            router.get('/contacts', newFilters, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    }, [debouncedSearch]);

    const handleFilterChange = (key: string, value: any) => {
        const newFilters: any = {
            search: search || undefined,
            group_id: key === 'group_id' ? value : filters.group_id,
            tag_id: key === 'tag_id' ? value : filters.tag_id,
            is_favorite: key === 'is_favorite' ? value : filters.is_favorite,
        };

        // Remove undefined values to clean up query string
        Object.keys(newFilters).forEach((k) => {
            if (newFilters[k] === undefined) {
                delete newFilters[k];
            }
        });

        router.get('/contacts', newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleFavorite = (contact: Contact) => {
        router.post(
            `/contacts/${contact.id}/toggle-favorite`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const confirmDelete = (contact: Contact) => {
        setDeleteContact(contact);
    };

    const handleDelete = () => {
        if (!deleteContact) return;

        router.delete(`/contacts/${deleteContact.id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setDeleteContact(null);
            },
        });
    };

    const getInitials = (contact: Contact) => {
        return `${contact.first_name[0]}${contact.last_name[0]}`.toUpperCase();
    };

    // Show loading state if no data
    if (!contacts) {
        return (
            <AppLayout>
                <Head title="Contacts" />
                <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                        <p className="mt-2 text-muted-foreground">
                            Đang tải danh bạ...
                        </p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Contacts" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Liên Hệ
                        </h1>
                        <p className="text-muted-foreground">
                            Quản lý và sắp xếp danh bạ của bạn một cách gọn gàng
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/contacts/trash">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Thùng Rác
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/contacts/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Thêm Liên Hệ
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lọc danh bạ</CardTitle>
                        <CardDescription>
                            Tìm kiếm và lọc danh bạ của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search contacts..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>

                            {/* Group Filter */}
                            <Select
                                value={filters.group_id?.toString() || 'all'}
                                onValueChange={(value) =>
                                    handleFilterChange(
                                        'group_id',
                                        value === 'all'
                                            ? undefined
                                            : parseInt(value),
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Groups" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tất cả Nhóm
                                    </SelectItem>
                                    {groups.map((group) => (
                                        <SelectItem
                                            key={group.id}
                                            value={group.id.toString()}
                                        >
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Tag Filter */}
                            <Select
                                value={filters.tag_id?.toString() || 'all'}
                                onValueChange={(value) =>
                                    handleFilterChange(
                                        'tag_id',
                                        value === 'all'
                                            ? undefined
                                            : parseInt(value),
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Tags" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tất cả Nhãn
                                    </SelectItem>
                                    {tags.map((tag) => (
                                        <SelectItem
                                            key={tag.id}
                                            value={tag.id.toString()}
                                        >
                                            {tag.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Favorite Filter */}
                            <Select
                                value={
                                    filters.is_favorite === true ||
                                    filters.is_favorite === 'true' ||
                                    filters.is_favorite === '1'
                                        ? 'favorites'
                                        : 'all'
                                }
                                onValueChange={(value) =>
                                    handleFilterChange(
                                        'is_favorite',
                                        value === 'favorites' ? '1' : undefined,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tất Cả" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tất Cả Liên Hệ
                                    </SelectItem>
                                    <SelectItem value="favorites">
                                        Yêu Thích
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact List */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {contacts?.data?.map((contact) => (
                        <Card key={contact.id} className="overflow-hidden">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={
                                                    contact.avatar_url ||
                                                    undefined
                                                }
                                            />
                                            <AvatarFallback>
                                                {getInitials(contact)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {contact.full_name}
                                            </CardTitle>
                                            {contact.job_title && (
                                                <CardDescription>
                                                    {contact.job_title}
                                                    {contact.company &&
                                                        ` at ${contact.company}`}
                                                </CardDescription>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                toggleFavorite(contact)
                                            }
                                        >
                                            <Heart
                                                className={`h-4 w-4 ${
                                                    contact.is_favorite
                                                        ? 'fill-red-500 text-red-500'
                                                        : ''
                                                }`}
                                            />
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/contacts/${contact.id}`}
                                                    >
                                                        <User className="mr-2 h-4 w-4" />
                                                        Xem Chi Tiết
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/contacts/${contact.id}/edit`}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Chỉnh Sửa
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() =>
                                                        confirmDelete(contact)
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {/* Phone */}
                                <div className="flex items-center space-x-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{contact.phone_number}</span>
                                </div>

                                {/* Email */}
                                {contact.email && (
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate">
                                            {contact.email}
                                        </span>
                                    </div>
                                )}

                                {/* Group */}
                                {contact.group && (
                                    <Badge
                                        variant="secondary"
                                        style={{
                                            backgroundColor:
                                                contact.group.color,
                                        }}
                                    >
                                        {contact.group.name}
                                    </Badge>
                                )}

                                {/* Tags */}
                                {contact.tags && contact.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {contact.tags.map((tag) => (
                                            <Badge
                                                key={tag.id}
                                                variant="outline"
                                                style={{
                                                    borderColor: tag.color,
                                                    color: tag.color,
                                                }}
                                            >
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {(!contacts?.data || contacts.data.length === 0) && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <User className="h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">
                                Không tìm thấy liên hệ
                            </h3>
                            <p className="text-muted-foreground">
                                {filters.search ||
                                filters.group_id ||
                                filters.tag_id
                                    ? 'Try adjusting your filters'
                                    : 'Get started by creating your first contact'}
                            </p>
                            {!filters.search && (
                                <Button asChild className="mt-4">
                                    <Link href="/contacts/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm Liên Hệ
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {contacts && contacts.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                router.get(
                                    '/contacts',
                                    {
                                        ...filters,
                                        search: search || undefined,
                                        page: contacts.current_page - 1,
                                    },
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                            }}
                            disabled={!contacts.prev_page_url}
                        >
                            ← Trước
                        </Button>
                        <span className="px-4 text-sm text-muted-foreground">
                            Trang {contacts.current_page} / {contacts.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                router.get(
                                    '/contacts',
                                    {
                                        ...filters,
                                        search: search || undefined,
                                        page: contacts.current_page + 1,
                                    },
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                            }}
                            disabled={!contacts.next_page_url}
                        >
                            Sau →
                        </Button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deleteContact}
                onOpenChange={(open) => !open && setDeleteContact(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa liên hệ</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa không?{' '}
                            <strong>{deleteContact?.full_name}</strong>? Hành
                            động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
