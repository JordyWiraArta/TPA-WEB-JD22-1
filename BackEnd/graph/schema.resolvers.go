package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jordywiraarta/golang-graphql/graph/generated"
	"github.com/jordywiraarta/golang-graphql/graph/model"
	"golang.org/x/crypto/bcrypt"
)

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (*model.User, error) {
	pass, _ := HashPassword(input.Password)
	user := &model.User{
		ID:              uuid.NewString(),
		FirstName:       input.FirstName,
		LastName:		 input.LastName,
		Email:           input.Email,
		Password:        pass,
		ProfilePhoto:    "",
		BackgroundPhoto: "",
		Headline:        "",
		Job:             input.Job,
	}

	err := r.DB.Create(user).Error

	return user, err
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	var users []*model.User
	err := r.DB.Find(&users).Error

	return users, err
}

// CurrUser is the resolver for the currUser field.
func (r *queryResolver) CurrUser(ctx context.Context, userID string) (*model.User, error) {
	user := &model.User{ID: userID};
	err := r.DB.First(user).Error;

	return user, err
}

// Posts is the resolver for the posts field.
func (r *queryResolver) Posts(ctx context.Context) ([]*model.Post, error) {
	panic(fmt.Errorf("not implemented: Posts - posts"))
}

// UserPosts is the resolver for the userPosts field.
func (r *queryResolver) UserPosts(ctx context.Context, userID string) ([]*model.Post, error) {
	panic(fmt.Errorf("not implemented: UserPosts - userPosts"))
}

// UserInvitations is the resolver for the userInvitations field.
func (r *queryResolver) UserInvitations(ctx context.Context, userID string) ([]*model.ConnectInvitation, error) {
	panic(fmt.Errorf("not implemented: UserInvitations - userInvitations"))
}

// Comments is the resolver for the comments field.
func (r *queryResolver) Comments(ctx context.Context, postID string) ([]*model.Comment, error) {
	panic(fmt.Errorf("not implemented: Comments - comments"))
}

// LikedComments is the resolver for the likedComments field.
func (r *queryResolver) LikedComments(ctx context.Context, userID string, commentID int) ([]*model.LikedComment, error) {
	panic(fmt.Errorf("not implemented: LikedComments - likedComments"))
}

// LikedPost is the resolver for the likedPost field.
func (r *queryResolver) LikedPost(ctx context.Context, userID string, postID int) ([]*model.LikedPost, error) {
	panic(fmt.Errorf("not implemented: LikedPost - likedPost"))
}

// Follows is the resolver for the follows field.
func (r *queryResolver) Follows(ctx context.Context, userID string) ([]*model.FollowedUser, error) {
	panic(fmt.Errorf("not implemented: Follows - follows"))
}

// Followers is the resolver for the followers field.
func (r *queryResolver) Followers(ctx context.Context, userID string) ([]*model.FollowedUser, error) {
	panic(fmt.Errorf("not implemented: Followers - followers"))
}

// Connects is the resolver for the connects field.
func (r *queryResolver) Connects(ctx context.Context, userID string) ([]*model.Connection, error) {
	panic(fmt.Errorf("not implemented: Connects - connects"))
}

// Connectors is the resolver for the connectors field.
func (r *queryResolver) Connectors(ctx context.Context, userID string) ([]*model.Connection, error) {
	panic(fmt.Errorf("not implemented: Connectors - connectors"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
