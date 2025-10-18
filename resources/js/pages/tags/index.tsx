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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, Tag } from '@/types/contact';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Search, Tag as TagIcon, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface TagsIndexProps {
    tags: PaginatedResponse<Tag & { contacts_count: number }>;
    filters: {
        search?: string;
    };
}

export default function TagsIndex({ tags, filters }: TagsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteTag, setDeleteTag] = useState<
        (Tag & { contacts_count: number }) | null
    >(null);

    useDebounce(
        () => {
            router.get(
                '/tags',
                { search: search || undefined },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        },
        500,
        [search],
    );

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
    };

    const confirmDelete = (tag: Tag & { contacts_count: number }) => {
        setDeleteTag(tag);
    };

    const handleDelete = () => {
        if (!deleteTag) return;

        router.delete(`/tags/${deleteTag.id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setDeleteTag(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Quản lý nhãn" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Quản lý nhãn
                        </h1>
                        <p className="text-muted-foreground">
                            Gắn nhãn cho liên hệ để dễ quản lý
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/tags/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm nhãn
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm nhãn..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Tags Grid */}
                {tags.data.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {tags.data.map((tag) => (
                            <Card
                                key={tag.id}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <Badge
                                            style={{
                                                backgroundColor: tag.color,
                                                borderColor: tag.color,
                                            }}
                                            className="text-white"
                                        >
                                            <TagIcon className="mr-1 h-3 w-3" />
                                            {tag.name}
                                        </Badge>
                                    </div>
                                    <CardDescription className="pt-2 text-xs">
                                        {tag.contacts_count} liên hệ
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex gap-2 pb-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        asChild
                                    >
                                        <Link href={`/tags/${tag.id}`}>
                                            Xem chi tiết
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/tags/${tag.id}/edit`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => confirmDelete(tag)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex min-h-[200px] flex-col items-center justify-center py-12">
                            <TagIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-1 text-lg font-semibold">
                                Chưa có nhãn nào
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Tạo nhãn đầu tiên để gắn cho liên hệ
                            </p>
                            <Button asChild>
                                <Link href="/tags/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm nhãn
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {tags.data.length > 0 && tags.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                router.get(
                                    '/tags',
                                    {
                                        search: search || undefined,
                                        page: tags.current_page - 1,
                                    },
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                            }}
                            disabled={tags.current_page === 1}
                        >
                            ← Trước
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Trang {tags.current_page} / {tags.last_page}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => {
                                router.get(
                                    '/tags',
                                    {
                                        search: search || undefined,
                                        page: tags.current_page + 1,
                                    },
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                            }}
                            disabled={tags.current_page === tags.last_page}
                        >
                            Sau →
                        </Button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deleteTag}
                onOpenChange={() => setDeleteTag(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa nhãn{' '}
                            <strong>{deleteTag?.name}</strong>? Nhãn này được
                            gắn cho <strong>{deleteTag?.contacts_count}</strong>{' '}
                            liên hệ.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Xóa nhãn
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
