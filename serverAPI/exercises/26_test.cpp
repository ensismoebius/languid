#include <gtest/gtest.h>

class Pilha
{
    int dados[10];
    int topo = -1;

public:
    void push(int v)
    {
        if (topo < 9)
            dados[++topo] = v;
    }
    int pop() { return (topo >= 0) ? dados[topo--] : -1; }
    int top() const { return (topo >= 0) ? dados[topo] : -1; }
};

TEST(PilhaTest, OperacoesBasicas)
{
    Pilha p;
    p.push(1);
    p.push(2);
    p.push(3);
    EXPECT_EQ(p.top(), 3);
    EXPECT_EQ(p.pop(), 3);
    EXPECT_EQ(p.top(), 2);
}
