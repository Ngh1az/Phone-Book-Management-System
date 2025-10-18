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
import AppLayout from '@/layouts/app-layout';
import { Contact, PaginatedResponse } from '@/types/contact';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Mail,
    MoreVertical,
    Phone,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface ContactsTrashProps {
    contacts: PaginatedResponse<Contact>;
}

export default function ContactsTrash({ contacts }: ContactsTrashProps) {
    const [restoreContact, setRestoreContact] = useState<Contact | null>(null);
    const [permanentDeleteContact, setPermanentDeleteContact] =
        useState<Contact | null>(null);

    const handleRestore = () => {
        if (!restoreContact) return;

        router.post(
            `/contacts/${restoreContact.id}/restore`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setRestoreContact(null);
                },
            },
        );
    };

    const handlePermanentDelete = () => {
        if (!permanentDeleteContact) return;

        // Note: You may need to add a force delete route
        // For now, this will be a placeholder
        router.delete(`/contacts/${permanentDeleteContact.id}/force`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setPermanentDeleteContact(null);
            },
        });
    };

    const getInitials = (contact: Contact) => {
        return `${contact.first_name[0]}${contact.last_name[0]}`.toUpperCase();
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="Thùng Rác - Liên Hệ" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/contacts">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Quay lại
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Thùng Rác
                        </h1>
                        <p className="text-muted-foreground">
                            Khôi phục hoặc xóa vĩnh viễn liên hệ đã xóa
                        </p>
                    </div>
                </div>

                {/* Info Banner */}
                <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                    <CardHeader>
                        <CardTitle className="text-yellow-900 dark:text-yellow-100">
                            ⚠️ Lưu ý
                        </CardTitle>
                        <CardDescription className="text-yellow-800 dark:text-yellow-200">
                            Các liên hệ trong thùng rác có thể được khôi phục
                            hoặc xóa vĩnh viễn. Sau khi xóa vĩnh viễn, dữ liệu
                            sẽ không thể khôi phục.
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Contacts List */}
                {contacts.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
                            <Trash2 className="mb-4 h-16 w-16 text-muted-foreground" />
                            <h3 className="mb-2 text-xl font-semibold">
                                Thùng rác trống
                            </h3>
                            <p className="text-muted-foreground">
                                Không có liên hệ nào trong thùng rác
                            </p>
                            <Button asChild className="mt-4">
                                <Link href="/contacts">
                                    Quay lại danh sách liên hệ
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {contacts.data.map((contact) => (
                                <Card
                                    key={contact.id}
                                    className="overflow-hidden transition-all hover:shadow-md"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage
                                                        src={
                                                            contact.avatar_url ||
                                                            undefined
                                                        }
                                                        alt={contact.full_name}
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
                                                        <p className="text-sm text-muted-foreground">
                                                            {contact.job_title}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setRestoreContact(
                                                                contact,
                                                            )
                                                        }
                                                    >
                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                        Khôi phục
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setPermanentDeleteContact(
                                                                contact,
                                                            )
                                                        }
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Xóa vĩnh viễn
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span>{contact.phone_number}</span>
                                        </div>
                                        {contact.email && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate">
                                                    {contact.email}
                                                </span>
                                            </div>
                                        )}
                                        {contact.deleted_at && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-xs">
                                                    Đã xóa:{' '}
                                                    {formatDate(
                                                        contact.deleted_at,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {contact.group && (
                                            <Badge
                                                style={{
                                                    backgroundColor:
                                                        contact.group.color,
                                                }}
                                                className="mt-2"
                                            >
                                                {contact.group.name}
                                            </Badge>
                                        )}
                                        {contact.tags &&
                                            contact.tags.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {contact.tags.map((tag) => (
                                                        <Badge
                                                            key={tag.id}
                                                            variant="outline"
                                                            style={{
                                                                borderColor:
                                                                    tag.color,
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

                        {/* Pagination */}
                        {contacts.last_page > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Hiển thị {contacts.from} đến {contacts.to}{' '}
                                    trong tổng số {contacts.total} liên hệ
                                </p>
                                <div className="flex gap-2">
                                    {contacts.prev_page_url && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(
                                                    contacts.prev_page_url!,
                                                )
                                            }
                                        >
                                            ← Trước
                                        </Button>
                                    )}
                                    {contacts.next_page_url && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.get(
                                                    contacts.next_page_url!,
                                                )
                                            }
                                        >
                                            Sau →
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Restore Confirmation Dialog */}
            <AlertDialog
                open={!!restoreContact}
                onOpenChange={(open) => !open && setRestoreContact(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Khôi phục liên hệ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn khôi phục liên hệ "
                            {restoreContact?.full_name}"? Liên hệ sẽ được hiển
                            thị lại trong danh sách chính.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestore}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Khôi phục
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Permanent Delete Confirmation Dialog */}
            <AlertDialog
                open={!!permanentDeleteContact}
                onOpenChange={(open) =>
                    !open && setPermanentDeleteContact(null)
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">
                            Xóa vĩnh viễn liên hệ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa vĩnh viễn liên hệ "
                            {permanentDeleteContact?.full_name}"? Hành động này{' '}
                            <strong>không thể hoàn tác</strong> và dữ liệu sẽ bị
                            mất hoàn toàn.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handlePermanentDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa vĩnh viễn
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
